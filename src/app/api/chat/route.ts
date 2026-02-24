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

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const dbUser = await db.collection("user").findOneAndUpdate(
    {
      _id: new ObjectId(userId),
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
  const now = new Date();

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
        textVerbosity: "low",
        user: userId,
        safetyIdentifier: userId,
        maxToolCalls: 5,
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
    void recordAiUsage({
      userId,
      userEmail: session.user.email,
      modelName: "gpt-5-nano",
      promptTokens: usage.inputTokens ?? 0,
      completionTokens: usage.outputTokens ?? 0,
    });
  });

  return response;
}
