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
} from "@/lib/ai/tools";
import { recordAiUsage } from "@/lib/ai/trackUsage";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { logger } from "@/lib/logger";
import { getISTMidnight } from "@/lib/ist";

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
  const todayISTMidnight = getISTMidnight();

  const dbUser = await db.collection("user").findOneAndUpdate(
    {
      _id: new ObjectId(userId),
      $or: [
        { isPremium: true },
        { freeTrials: { $gt: 0 } },
        { freeTrialResetAt: { $lt: todayISTMidnight } },
      ],
    },
    [
      {
        $set: {
          freeTrialResetAt: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$isPremium", true] },
                  { $lt: ["$freeTrialResetAt", todayISTMidnight] },
                ],
              },
              then: todayISTMidnight,
              else: "$freeTrialResetAt",
            },
          },
          freeTrials: {
            $cond: {
              if: { $eq: ["$isPremium", true] },
              then: "$freeTrials",
              else: {
                $subtract: [
                  {
                    $cond: {
                      if: { $lt: ["$freeTrialResetAt", todayISTMidnight] },
                      then: 7,
                      else: "$freeTrials",
                    },
                  },
                  1,
                ],
              },
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

  const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    ?.parts?.[0];
  const rawInput =
    lastUserMessage && "text" in lastUserMessage ? lastUserMessage.text : "";

  const toolParams = { userId, rawInput };

  const currentDateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const result = streamText({
    model: openai("gpt-5-nano"),
    system: SYSTEM_PROMPT(currentDateStr),
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        textVerbosity: "low",
        user: userId,
        safetyIdentifier: userId,
        maxToolCalls: 5,
        truncation: "auto",
        store: false,
      },
    },
    tools: {
      saveExpense: createSaveExpenseTool(toolParams),
      saveIncome: createSaveIncomeTool(toolParams),
      searchTransactions: createSearchTransactionsTool({
        userId,
        userEmail: session.user.email,
        currentDate: now,
      }),
      deleteTransaction: createDeleteTransactionTool({ userId }),
      updateTransaction: createUpdateTransactionTool({ userId }),
    },
    stopWhen: stepCountIs(5),
  });

  const response = result.toUIMessageStreamResponse({ sendReasoning: true });

  after(async () => {
    const usage = await result.usage;
    const metadata = await result.providerMetadata;
    const cachedTokens = (metadata?.openai?.cachedPromptTokens as number) ?? 0;
    const promptTokens = usage.inputTokens ?? 0;
    const completionTokens = usage.outputTokens ?? 0;
    try {
      await recordAiUsage({
        userId,
        userEmail: session.user.email,
        modelName: "gpt-5-nano",
        promptTokens,
        completionTokens,
        cachedTokens,
      });
      logger.info("chat_complete", {
        userId,
        data: { promptTokens, completionTokens, cachedTokens },
      });
    } catch (e) {
      logger.error("ai_usage_record_fail", { userId, error: e });
    }
  });

  return response;
}
