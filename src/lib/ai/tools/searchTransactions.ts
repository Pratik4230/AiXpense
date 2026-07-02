import { tool, generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import { logger } from "@/lib/logger";
import {
  getUtcDayRangeInclusive,
  getUtcMonthRangeHalfOpen,
  getUtcYearRangeHalfOpen,
  utcCalendarDateString,
  utcMonthKey,
} from "@/lib/utcDates";

interface ToolParams {
  userId: string;
  currentDate: Date;
}

type SpecialistOutput = {
  filter?: Record<string, unknown>;
  aggregation?: Record<string, unknown>[];
  explanation?: string;
};

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

const SPECIALIST_SYSTEM_PROMPT = `You are a MongoDB Query Expert Specialist.
Convert natural language financial questions into a MongoDB filter and/or aggregation pipeline.

DATABASE SCHEMA (Expense Collection):
- item: string (e.g. "Starbucks Coffee", "Electricity Bill")
- amount: number — stored in the user's account currency
- currency: string (ISO 4217) — only filter when the user explicitly asks
- category: string (Enum: food, groceries, transport, shopping, entertainment, subscriptions, bills, rent, emi, health, education, personal, travel, salary, bonus, freelance, business, investment, interest, cashback, rental, refund, gift, other)
- subcategory: string (optional)
- type: "expense" | "income"
- date: Date (BSON UTC instant)
- tags: string[]

RULES:
1. SECURITY: Read-only. NO $where, $function, or mutation operators.
2. SYNTAX: Use '$' on all operators ("$match", "$group", "$sum", "$regex", "$gte", "$lt").
3. DATES: You resolve ALL date ranges from the user's words (today, this month, last 3 months, Q1, since January, between dates, etc.). Use half-open month boundaries: $gte month start, $lt next month/year start. Plain ISO 8601 strings only — never ISODate() or new Date().
4. DEFAULT: If the user gives NO time period, omit date from filter — the tool applies current UTC month.
5. FILTER + AGGREGATION: Put every match criterion in top-level \`filter\` (category, type, date, amount, item). Stages in \`aggregation\` run after that $match. Never put match-only criteria only inside aggregation.
6. TYPE: Spending/expense questions → filter.type = "expense". Income questions → filter.type = "income".
7. ANALYTICS: totals/counts/averages → aggregation with $group. Biggest/largest → filter.type = "expense" + aggregation [{ "$sort": { "amount": -1 } }, { "$limit": 1 }]. Lists → filter only (no aggregation).
8. MULTI-PERIOD: When comparing or listing across months, use one date range in filter and $group by month if totals per period are needed: { "$group": { "_id": { "$dateToString": { "format": "%Y-%m", "date": "$date" } }, "total": { "$sum": "$amount" }, "count": { "$sum": 1 } } }.
9. REGEX: { "$regex": "pattern", "$options": "i" } on item for merchant/text search.
10. CATEGORIES: Map fuzzy terms ("eating out") to enum values ("food").
11. OUTPUT: Return one JSON object only — keys: filter (optional object), aggregation (optional array), explanation (optional string). No markdown fences.`;

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

type TxLean = {
  _id: mongoose.Types.ObjectId;
  item: string;
  amount: number;
  category: string;
  subcategory?: string;
  type: string;
  date: Date;
  tags?: string[];
};

function pipelineNeedsLimit(stages: Record<string, unknown>[]): boolean {
  if (stages.some((s) => "$limit" in s)) return false;
  const last = stages[stages.length - 1];
  if (!last) return true;
  if ("$group" in last) {
    const group = last.$group as Record<string, unknown>;
    if (group._id === null || group._id === undefined) return false;
  }
  if ("$count" in last) return false;
  return true;
}

/** Derived from returned rows — no query-string heuristics. */
function buildByMonthSummary(transactions: TxLean[]) {
  if (transactions.length === 0) return undefined;

  const monthMap = new Map<
    string,
    {
      month: string;
      label: string;
      totalAmount: number;
      count: number;
      expenseTotal: number;
      incomeTotal: number;
    }
  >();

  for (const tx of transactions) {
    const key = utcMonthKey(tx.date);
    if (!monthMap.has(key)) {
      const d = new Date(
        Date.UTC(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, 1),
      );
      monthMap.set(key, {
        month: key,
        label: d.toLocaleDateString("en", {
          timeZone: "UTC",
          month: "long",
          year: "numeric",
        }),
        totalAmount: 0,
        count: 0,
        expenseTotal: 0,
        incomeTotal: 0,
      });
    }
    const row = monthMap.get(key)!;
    row.count += 1;
    row.totalAmount += tx.amount;
    if (tx.type === "expense") row.expenseTotal += tx.amount;
    else row.incomeTotal += tx.amount;
  }

  const months = [...monthMap.values()].sort((a, b) =>
    a.month.localeCompare(b.month),
  );
  return months.length > 1 ? months : undefined;
}

function mapTransaction(tx: TxLean) {
  return {
    id: tx._id.toString(),
    item: tx.item,
    amount: tx.amount,
    category: tx.category,
    subcategory: tx.subcategory,
    type: tx.type,
    date: tx.date.toISOString(),
    tags: tx.tags,
  };
}

function formatDefaultMonthContext(monthStart: Date, monthEndExclusive: Date) {
  const fmt = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return ` (Data for current month UTC: ${fmt.format(monthStart)} – ${fmt.format(new Date(monthEndExclusive.getTime() - 1))})`;
}

export const createSearchTransactionsTool = ({
  userId,
  currentDate,
}: ToolParams) => {
  const todayUtc = utcCalendarDateString(currentDate);
  const { start: todayStartUTC, end: todayEndUTC } =
    getUtcDayRangeInclusive(currentDate);
  const { start: monthStartUTC, endExclusive: monthEndExclusive } =
    getUtcMonthRangeHalfOpen(currentDate);
  const { start: yearStartUTC, endExclusive: yearEndExclusive } =
    getUtcYearRangeHalfOpen(currentDate);

  return tool({
    description: `Search user's transactions.
    
    USAGE: 
    - Pass user's natural language question to 'query' parameter (e.g., "how much spent on food?").
    - The tool will handle date filtering, categories, and analytics automatically.
    
    CURRENT DATE (UTC calendar): ${todayUtc}`,
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

      if (query && !filter && !aggregation) {
        try {
          const { output } = await generateText({
            model: openai("gpt-5.4-mini"),
            output: Output.json(),
            system: SPECIALIST_SYSTEM_PROMPT,
            prompt: `Anchor date (UTC calendar): ${todayUtc}
Reference bounds (use when the user's words map to these; compute any other range yourself):
- Today: { "$gte": "${todayStartUTC.toISOString()}", "$lte": "${todayEndUTC.toISOString()}" }
- This month: { "$gte": "${monthStartUTC.toISOString()}", "$lt": "${monthEndExclusive.toISOString()}" }
- This year: { "$gte": "${yearStartUTC.toISOString()}", "$lt": "${yearEndExclusive.toISOString()}" }

User question: ${query}

Respond in JSON.`,
            providerOptions: {
              openai: {
                reasoningEffort: "low",
                promptCacheKey: "specialist-system-v2",
                store: false,
              },
            },
          });

          const parsed = output as SpecialistOutput;

          finalFilter = parsed.filter
            ? (convertDateStrings(parsed.filter) as Record<string, unknown>)
            : undefined;
          finalAggregation = parsed.aggregation
            ? (convertDateStrings(parsed.aggregation) as Record<
                string,
                unknown
              >[])
            : undefined;
          finalExplanation = parsed.explanation || "Generated by Specialist AI";
        } catch (err) {
          logger.error("search_specialist_fail", {
            userId,
            error: err,
            data: { query: query?.slice(0, 200) },
          });
          return {
            type: "error" as const,
            message: "Failed to understand query. Please try again.",
          };
        }
      }

      const safeLimit = Math.min(limit || 20, 50);

      const userProvidedDateFilter =
        hasDateFilter(finalFilter) || hasDateFilter(finalAggregation);
      const shouldApplyDefaultDate =
        includeDateFilter !== false && !userProvidedDateFilter;

      const dateContextString = shouldApplyDefaultDate
        ? formatDefaultMonthContext(monthStartUTC, monthEndExclusive)
        : "";

      const dateRangeMeta = shouldApplyDefaultDate
        ? {
            from: monthStartUTC.toISOString(),
            to: new Date(monthEndExclusive.getTime() - 1).toISOString(),
          }
        : ("user-specified or all-time" as const);

      try {
        if (finalAggregation && finalAggregation.length > 0) {
          validateQuery(finalAggregation);
          if (finalFilter) validateQuery(finalFilter);

          const matchStage: Record<string, unknown> = {
            userId: new mongoose.Types.ObjectId(userId),
            ...(finalFilter || {}),
          };
          if (shouldApplyDefaultDate) {
            matchStage.date = {
              $gte: monthStartUTC,
              $lt: monthEndExclusive,
            };
          }

          const pipeline: Record<string, unknown>[] = [
            { $match: matchStage },
            ...finalAggregation,
          ];
          if (pipelineNeedsLimit(finalAggregation)) {
            pipeline.push({ $limit: safeLimit });
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const results = await Expense.aggregate(pipeline as any);

          return {
            type: "aggregation" as const,
            results,
            explanation:
              (finalExplanation || "Aggregation query executed") +
              dateContextString,
            queryUsed: {
              filter: finalFilter || {},
              aggregation: finalAggregation,
            },
            dateRange: dateRangeMeta,
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
          safeFilter.date = {
            $gte: monthStartUTC,
            $lt: monthEndExclusive,
          };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sortOrder = (sort || { date: -1 }) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transactions = (await Expense.find(safeFilter as any)
          .sort(sortOrder)
          .limit(safeLimit)
          .lean()) as TxLean[];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allMatching = (await Expense.find(safeFilter as any).lean()) as TxLean[];

        const byCategory: Record<string, number> = {};
        const categoryCounts: Record<string, number> = {};
        const byType: Record<string, number> = { expense: 0, income: 0 };
        let totalAmount = 0;

        for (const tx of allMatching) {
          totalAmount += tx.amount;
          byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
          categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1;
          byType[tx.type] = (byType[tx.type] || 0) + tx.amount;
        }

        const mapped = transactions.map(mapTransaction);
        const hasBothTypes =
          mapped.some((t) => t.type === "expense") &&
          mapped.some((t) => t.type === "income");

        return {
          type: "find" as const,
          transactions: mapped,
          ...(hasBothTypes
            ? {
                transactionsByType: {
                  expenses: mapped.filter((t) => t.type === "expense"),
                  income: mapped.filter((t) => t.type === "income"),
                },
              }
            : {}),
          summary: {
            totalAmount,
            count: allMatching.length,
            byCategory,
            categoryCounts,
            byType,
            byMonth: buildByMonthSummary(allMatching),
          },
          explanation:
            (finalExplanation || "Search query executed") + dateContextString,
          queryUsed: { filter: finalFilter || {} },
          dateRange: dateRangeMeta,
        };
      } catch (error) {
        logger.error("search_query_fail", {
          userId,
          error,
          data: {
            hasAggregation: !!(finalAggregation && finalAggregation.length > 0),
            hasFilter: !!finalFilter,
          },
        });
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
