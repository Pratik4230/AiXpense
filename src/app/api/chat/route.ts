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
  const user = session.user as { isPremium?: boolean; freeTrials?: number };

  const isPremium = user.isPremium ?? false;
  const freeTrials = user.freeTrials ?? 5;

  if (!isPremium && freeTrials <= 0) {
    return new Response(
      JSON.stringify({
        error: "No free trials remaining. Upgrade to premium.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!isPremium) {
    await db
      .collection("user")
      .updateOne({ _id: new ObjectId(userId) }, { $inc: { freeTrials: -1 } });
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
    model: openai("gpt-5-mini"),
    system: SYSTEM_PROMPT(currentDateStr),
    messages: await convertToModelMessages(messages),
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
      modelName: "gpt-5-mini",
      promptTokens: usage.inputTokens ?? 0,
      completionTokens: usage.outputTokens ?? 0,
    });
  });

  return response;
}
