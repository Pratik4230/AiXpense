import { convertToModelMessages, streamText, UIMessage, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SYSTEM_PROMPT } from "@/lib/constants/prompts";
import { createSaveExpenseTool, createSaveIncomeTool } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    ?.parts?.[0];
  const rawInput =
    lastUserMessage && "text" in lastUserMessage ? lastUserMessage.text : "";

  const toolParams = { userId, rawInput };

  const result = streamText({
    model: openai("gpt-5.1-codex-mini"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      saveExpense: createSaveExpenseTool(toolParams),
      saveIncome: createSaveIncomeTool(toolParams),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
