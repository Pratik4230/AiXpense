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
} from "@/lib/ai/tools";
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

  const interceptedMessages = messages.map((msg) => {
    if (msg.role === "user" && msg.parts) {
      const newParts = msg.parts.map((part) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (part.type === "file" && (part as any).url) {
          if (!dbUser.isPremium) {
            logger.warn("ocr_premium_required", { userId });
            return {
              type: "text" as const,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              text: `[System override: The user tried to upload a receipt image at ${(part as any).url}, but they do NOT have a Premium subscription. Inform the user that OCR bill scanning is a premium-only feature and they must upgrade.]`,
            };
          }

          return {
            type: "text" as const,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            text: `[System override: The user provided a receipt or document image at ${(part as any).url}. You MUST call the scanBill tool with this URL to extract its contents. Once scanBill returns the extracted details, you MUST immediately call saveExpense or saveIncome to save the transaction to the database.]`,
          };
        }
        return part;
      });
      return { ...msg, parts: newParts };
    }
    return msg;
  });

  const result = streamText({
    model: openai("gpt-5.4-nano"),
    system: SYSTEM_PROMPT(currentDateStr),
    messages: await convertToModelMessages(interceptedMessages),
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
    tools: {
      saveExpense: createSaveExpenseTool(toolParams),
      saveIncome: createSaveIncomeTool(toolParams),
      searchTransactions: createSearchTransactionsTool({
        userId,
        currentDate: now,
      }),
      deleteTransaction: createDeleteTransactionTool({ userId }),
      updateTransaction: createUpdateTransactionTool({ userId }),
      scanBill: createScanBillTool({ isPremium: dbUser.isPremium }),
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

    logger.info("chat_complete", {
      userId,
      data: { promptTokens, completionTokens, cachedTokens },
    });
  });

  return response;
}
