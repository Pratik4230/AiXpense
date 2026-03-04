import { tool, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import { recordAiUsage } from "@/lib/ai/trackUsage";

interface ToolParams {
  userId: string;
  userEmail: string;
  currentDate: Date;
}

const DANGEROUS_OPERATORS = [
  "$where",
  "$function",
  "$accumulator",
  "mapReduce",
  "$out",
  "$merge",
];

const DANGEROUS_KEYWORDS = [
  "delete",
  "remove",
  "drop",
  "update",
  "insert",
  "createIndex",
  "dropIndex",
  "renameCollection",
];

const SPECIALIST_SYSTEM_PROMPT = `You are a MongoDB Query Expert Specilaist.
Your task is to convert natural language financial queries into valid MongoDB query filters or aggregation pipelines.

DATABASE SCHEMA (Expense Collection):
- item: string (e.g. "Starbucks Coffee", "Electricity Bill")
- amount: number (e.g. 500)
- category: string (Enum: food, groceries, transport, shopping, entertainment, subscriptions, bills, rent, emi, health, education, personal, travel, salary, bonus, freelance, business, investment, interest, cashback, rental, refund, gift, other)
- subcategory: string (optional)
- type: "expense" | "income"
- date: Date (ISO 8601)
- tags: string[]

RULES:
1. SECURITY: NO $where, $function, or mutation commands. Read-only.
2. SYNTAX: You MUST use the '$' prefix for ALL operators (e.g., "$match", "$group", "$sum", "$regex"). Do NOT use "match" or "group" without "$".
3. REGEX: Use { "$regex": "pattern", "$options": "i" } for flexible text matching on 'item'.
4. CATEGORIES: Map fuzzy terms ("eating out") to standard enum ("food").
5. AGGREGATION: Use for "total", "count", "average", "stats".
6. FIND: Use for "show me", "list", "search".
7. DEFAULT DATE: Do NOT add date filters unless user explicitly mentions a date period (e.g. "last month", "Jan"). The tool handles the default "current month" context automatically.
8. ITEMS: Be specific! "Electricity bill" -> { item: { "$regex": "electricity", "$options": "i" } }.

OUTPUT:
Return a JSON object with 'filter' (for find) OR 'aggregation' (for analytics), and a short 'explanation'.
EXAMPLE JSON:
{
  "aggregation": [
    { "$match": { "type": "expense", "item": { "$regex": "coffee", "$options": "i" } } },
    { "$group": { "_id": null, "total": { "$sum": "$amount" } } }
  ]
}`;

function validateQuery(obj: unknown, path = ""): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => validateQuery(item, `${path}[${i}]`));
    return;
  }

  for (const key of Object.keys(obj as Record<string, unknown>)) {
    if (DANGEROUS_OPERATORS.includes(key)) {
      throw new Error(`Operator "${key}" is not allowed for security reasons`);
    }

    if (key === "userId") {
      throw new Error("Cannot override userId filter");
    }

    const value = (obj as Record<string, unknown>)[key];

    if (typeof value === "string") {
      const lowerValue = value.toLowerCase();
      for (const keyword of DANGEROUS_KEYWORDS) {
        if (lowerValue.includes(keyword)) {
          throw new Error(`Keyword "${keyword}" is not allowed`);
        }
      }
    }

    validateQuery(value, `${path}.${key}`);
  }
}

function hasDateFilter(obj: unknown): boolean {
  if (obj === null || obj === undefined) return false;
  if (typeof obj !== "object") return false;

  if (Array.isArray(obj)) {
    return obj.some((item) => hasDateFilter(item));
  }

  for (const key of Object.keys(obj as Record<string, unknown>)) {
    if (key === "date") return true;
    if (hasDateFilter((obj as Record<string, unknown>)[key])) return true;
  }
  return false;
}

function convertDateStrings(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(convertDateStrings);
  if (typeof obj === "string") {
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z?)?$/.test(obj)) {
      const d = new Date(obj);
      if (!isNaN(d.getTime())) return d;
    }
    return obj;
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k,
        convertDateStrings(v),
      ]),
    );
  }
  return obj;
}

function getMonthBoundsIST(date: Date): { start: Date; end: Date } {
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istDate = new Date(date.getTime() + istOffset);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();

  const startIST = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const startUTC = new Date(startIST.getTime() - istOffset);

  const endIST = new Date(
    Date.UTC(year, month, istDate.getUTCDate(), 23, 59, 59, 999),
  );
  const endUTC = new Date(endIST.getTime() - istOffset);

  return { start: startUTC, end: endUTC };
}

function getTodayBoundsIST(date: Date): { start: Date; end: Date } {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);
  const year = istDate.getUTCFullYear();
  const month = istDate.getUTCMonth();
  const day = istDate.getUTCDate();

  const startIST = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const startUTC = new Date(startIST.getTime() - istOffset);

  const endIST = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  const endUTC = new Date(endIST.getTime() - istOffset);

  return { start: startUTC, end: endUTC };
}

export const createSearchTransactionsTool = ({
  userId,
  userEmail,
  currentDate,
}: ToolParams) => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(currentDate.getTime() + istOffset);
  const todayIST = istNow.toISOString().split("T")[0];
  const { start: todayStartUTC, end: todayEndUTC } =
    getTodayBoundsIST(currentDate);
  const { start: monthStartUTC0 } = getMonthBoundsIST(currentDate);

  return tool({
    description: `Search user's transactions.
    
    USAGE: 
    - Pass user's natural language question to 'query' parameter (e.g., "how much spent on food?").
    - The tool will handle date filtering, categories, and analytics automatically.
    
    CURRENT DATE: ${todayIST}`,
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe("Natural language query (e.g., 'how much on food?')"),
      filter: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("Manual MongoDB filter (Advanced)"),
      aggregation: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("Manual MongoDB aggregation (Advanced)"),
      sort: z.record(z.string(), z.number()).optional(),
      limit: z.number().optional(),
      includeDateFilter: z.boolean().optional(),
      explanation: z.string().optional(),
    }),
    execute: async ({
      query,
      filter,
      aggregation,
      sort,
      limit,
      includeDateFilter,
      explanation,
    }) => {
      await connectDB();

      let finalFilter = filter;
      let finalAggregation = aggregation;
      let finalExplanation = explanation;

      // SPECIALIST AGENT: Generate MongoDB query if natural language query is provided
      if (query && !filter && !aggregation) {
        try {
          const { text, usage } = await generateText({
            model: openai("gpt-5-nano"),
            system:
              SPECIALIST_SYSTEM_PROMPT +
              "\n\nCRITICAL: OUTPUT MUST BE VALID JSON ONLY.",
            prompt: `User timezone: IST (UTC+5:30). DB stores all dates in UTC.
Today in IST: ${todayIST}
Today UTC range: { "$gte": "${todayStartUTC.toISOString()}", "$lte": "${todayEndUTC.toISOString()}" }
This month UTC start: "${monthStartUTC0.toISOString()}"
User Query: ${query}

IMPORTANT: When user refers to "today", use the exact UTC range above. All date values in your JSON must be ISO strings in UTC.`,
            providerOptions: {
              openai: {
                promptCacheKey: "specialist-system-v1",
                store: false,
                textVerbosity: "low",
              },
            },
          });

          void recordAiUsage({
            userId,
            userEmail,
            modelName: "gpt-5-nano",
            promptTokens: usage.inputTokens ?? 0,
            completionTokens: usage.outputTokens ?? 0,
          });

          // Clean up potential markdown code blocks (```json ... ```)
          const cleanJson = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          let output;
          try {
            output = JSON.parse(cleanJson);
          } catch {
            console.error("Failed to parse Specialist JSON:", cleanJson);
            throw new Error("Invalid JSON from Specialist Agent");
          }

          finalFilter = output.filter
            ? (convertDateStrings(output.filter) as Record<string, unknown>)
            : undefined;
          finalAggregation = output.aggregation
            ? (convertDateStrings(output.aggregation) as Record<
                string,
                unknown
              >[])
            : undefined;
          finalExplanation = output.explanation || "Generated by Specialist AI";
        } catch (err) {
          console.error("!!! Specialist Agent Failed !!!", err);
          return {
            type: "error" as const,
            message: "Failed to understand query. Please try again.",
          };
        }
      }

      const safeLimit = Math.min(limit || 20, 50);
      const { start: monthStartUTC, end: monthEndUTC } =
        getMonthBoundsIST(currentDate);

      const userProvidedDateFilter =
        hasDateFilter(finalFilter) || hasDateFilter(finalAggregation);
      const shouldApplyDefaultDate =
        includeDateFilter !== false && !userProvidedDateFilter;

      let dateContextString = "";
      if (shouldApplyDefaultDate) {
        // Format for readability: "Feb 1, 2026 - Feb 28, 2026"
        const fmt = new Intl.DateTimeFormat("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        });
        dateContextString = ` (Data for current month: ${fmt.format(monthStartUTC)} - ${fmt.format(monthEndUTC)})`;
      }

      try {
        if (finalAggregation && finalAggregation.length > 0) {
          validateQuery(finalAggregation);

          // AGGREGATION FIX: Mongoose aggregate() does NOT auto-cast strings to ObjectIds.
          // We must explicitly cast userId here.
          const matchStage: Record<string, unknown> = {
            userId: new mongoose.Types.ObjectId(userId),
          };
          if (shouldApplyDefaultDate) {
            matchStage.date = { $gte: monthStartUTC, $lte: monthEndUTC };
          }

          const pipeline = [
            { $match: matchStage },
            ...finalAggregation,
            { $limit: safeLimit },
          ];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const results = await Expense.aggregate(pipeline as any);

          return {
            type: "aggregation" as const,
            results,
            explanation:
              (finalExplanation || "Aggregation query executed") +
              dateContextString,
            queryUsed: { aggregation: finalAggregation },
            dateRange: shouldApplyDefaultDate
              ? {
                  from: monthStartUTC.toISOString(),
                  to: monthEndUTC.toISOString(),
                }
              : "all-time or user-specified",
          };
        }

        if (finalFilter) {
          validateQuery(finalFilter);
        }

        const safeFilter: Record<string, unknown> = {
          ...(finalFilter || {}),
          userId,
        };
        if (shouldApplyDefaultDate) {
          safeFilter.date = { $gte: monthStartUTC, $lte: monthEndUTC };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sortOrder = (sort || { date: -1 }) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transactions = await Expense.find(safeFilter as any)
          .sort(sortOrder)
          .limit(safeLimit)
          .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allMatching = await Expense.find(safeFilter as any).lean();

        const byCategory: Record<string, number> = {};
        const byType: Record<string, number> = { expense: 0, income: 0 };
        let totalAmount = 0;

        for (const tx of allMatching) {
          totalAmount += tx.amount;
          byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
          byType[tx.type] = (byType[tx.type] || 0) + tx.amount;
        }

        return {
          type: "find" as const,
          transactions: transactions.map((tx) => ({
            id: tx._id.toString(),
            item: tx.item,
            amount: tx.amount,
            category: tx.category,
            subcategory: tx.subcategory,
            type: tx.type,
            date: tx.date.toISOString(),
            tags: tx.tags,
          })),
          summary: {
            totalAmount,
            count: allMatching.length,
            byCategory,
            byType,
          },
          explanation:
            (finalExplanation || "Search query executed") + dateContextString,
          queryUsed: { filter: finalFilter || {} },
          dateRange: shouldApplyDefaultDate
            ? {
                from: monthStartUTC.toISOString(),
                to: monthEndUTC.toISOString(),
              }
            : "all-time or user-specified",
        };
      } catch (error) {
        return {
          type: "error" as const,
          message:
            error instanceof Error ? error.message : "Query execution failed",
          explanation: "Query failed due to validation or execution error",
        };
      }
    },
  });
};
