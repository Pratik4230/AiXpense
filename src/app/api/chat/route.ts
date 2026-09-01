import { convertToModelMessages, streamText, UIMessage, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { after } from "next/server";
import { SYSTEM_PROMPT } from "@/constants/prompts";
import {
  createSaveExpenseTool,
  createSaveIncomeTool,
  createSearchTransactionsTool,
  createDeleteTransactionTool,
  createUpdateTransactionTool,
  createScanBillTool,
  createCreateUpdateBudgetTool,
  createDeleteBudgetTool,
  createReadBudgetsTool,
  createListSupportedCurrenciesTool,
} from "@/lib/ai/tools";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";
import { getCurrency } from "@/constants/currency";
import { effectivePremium } from "@/lib/premium";
import { resolveUserCurrencyCode } from "@/lib/userCurrency";
import { FREE_LIFETIME_LIMIT } from "@/constants/trials";
import { formatUtcCalendarDateLong } from "@/lib/utcDates";
import {
  getAiErrorHttpStatus,
  getUserFacingAiErrorMessage,
} from "@/lib/ai/userFacingError";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    logger.warn("chat_unauthorized", {});
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const now = new Date();

  await connectDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Cap legacy accounts that still have a balance above the current limit.
  await mongoose.connection.db!.collection("user").updateOne(
    {
      _id: userObjectId,
      isPremium: { $ne: true },
      freeTrials: { $gt: FREE_LIFETIME_LIMIT },
    },
    { $set: { freeTrials: FREE_LIFETIME_LIMIT } },
  );

  // Lifetime free quota: decrement freeTrials until 0 (no daily reset).
  const dbUser = await mongoose.connection.db!
    .collection("user")
    .findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(userId),
        $or: [{ isPremium: true }, { freeTrials: { $gt: 0 } }],
      },
      [
        {
          $set: {
            freeTrials: {
              $cond: {
                if: { $eq: ["$isPremium", true] },
                then: "$freeTrials",
                else: { $subtract: ["$freeTrials", 1] },
              },
            },
          },
        },
      ],
      { returnDocument: "before" },
    );

  if (!dbUser) {
    logger.warn("chat_quota_exceeded", { userId });
    return new Response(
      JSON.stringify({
        error: "No free trials remaining. Upgrade to premium.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid messages" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (messages.length > 50) {
    return new Response(JSON.stringify({ error: "Too many messages" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    ?.parts?.[0];
  const rawInputFull =
    lastUserMessage && "text" in lastUserMessage ? lastUserMessage.text : "";

  const MAX_INPUT_CHARS = 2000;
  if (rawInputFull.length > MAX_INPUT_CHARS) {
    logger.warn("chat_input_too_long", { userId, data: { length: rawInputFull.length } });
    return new Response(
      JSON.stringify({ error: "Message too long. Please keep it under 2000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const rawInput = rawInputFull;

  const userCurrency = getCurrency(resolveUserCurrencyCode(dbUser.currency));

  const toolParams = {
    userId,
    rawInput,
    currency: userCurrency.code,
  };

  const currentDateStr = formatUtcCalendarDateLong(now);

  const interceptedMessages = messages.map((msg) => {
    if (msg.role === "user" && msg.parts) {
      const newParts = msg.parts.map((part) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (part.type === "file" && (part as any).url) {
          if (
            !effectivePremium({
              isPremium: dbUser.isPremium as boolean | undefined,
            })
          ) {
            logger.warn("ocr_premium_required", { userId });
            return {
              type: "text" as const,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              text: `[System override: The user tried to upload a receipt document at ${(part as any).url}, but they do NOT have a Premium subscription. Inform the user that OCR bill scanning is a premium-only feature and they must upgrade.]`,
            };
          }

          return {
            type: "text" as const,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            text: `[System override: The user provided a receipt document at ${(part as any).url}. You MUST call the scanBill tool with this URL to extract its contents (supports images and PDFs). Once scanBill returns the extracted details, you MUST immediately call saveExpense or saveIncome to save the transaction to the database.]`,
          };
        }
        return part;
      });
      return { ...msg, parts: newParts };
    }
    return msg;
  });

  const tools = {
    saveExpense: createSaveExpenseTool(toolParams),
    saveIncome: createSaveIncomeTool(toolParams),
    searchTransactions: createSearchTransactionsTool({
      userId,
      currentDate: now,
    }),
    deleteTransaction: createDeleteTransactionTool({ userId }),
    updateTransaction: createUpdateTransactionTool({ userId }),
    scanBill: createScanBillTool({
      isPremium: effectivePremium({
        isPremium: dbUser.isPremium as boolean | undefined,
      }),
      currencyCode: userCurrency.code,
      currencySymbol: userCurrency.symbol,
    }),
    createUpdateBudget: createCreateUpdateBudgetTool({
      userId,
      currency: userCurrency.code,
    }),
    deleteBudget: createDeleteBudgetTool({ userId }),
    readBudgets: createReadBudgetsTool({ userId }),
    listSupportedCurrencies: createListSupportedCurrenciesTool({
      accountCurrencyCode: userCurrency.code,
    }),
  };

  try {
    const result = streamText({
      model: openai("gpt-5.4-nano"),
      system: SYSTEM_PROMPT(currentDateStr, userCurrency.code, userCurrency.symbol),
      messages: await convertToModelMessages(interceptedMessages, {
        tools,
        ignoreIncompleteToolCalls: true,
      }),
      maxOutputTokens: 1500,
      providerOptions: {
        openai: {
          reasoningEffort: "medium",
          textVerbosity: "low",
          user: userId,
          safetyIdentifier: userId,
          maxToolCalls: 5,
          truncation: "auto",
          store: false,
        },
      },
      tools,
      stopWhen: stepCountIs(5),
    });

    const response = result.toUIMessageStreamResponse({
      sendReasoning: true,
      onError: (error) => getUserFacingAiErrorMessage(error),
    });

    after(async () => {
      try {
        const usage = await result.usage;
        const metadata = await result.providerMetadata;
        const cachedTokens = (metadata?.openai?.cachedPromptTokens as number) ?? 0;
        const promptTokens = usage.inputTokens ?? 0;
        const completionTokens = usage.outputTokens ?? 0;

        logger.info("chat_complete", {
          userId,
          data: { promptTokens, completionTokens, cachedTokens },
        });
      } catch (error) {
        logger.error("chat_ai_fail", {
          userId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    return response;
  } catch (error) {
    const userMessage = getUserFacingAiErrorMessage(error);
    const status = getAiErrorHttpStatus(error);

    logger.error("chat_ai_fail", {
      userId,
      error: error instanceof Error ? error.message : String(error),
      data: { status, userMessage },
    });

    return new Response(JSON.stringify({ error: userMessage }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
