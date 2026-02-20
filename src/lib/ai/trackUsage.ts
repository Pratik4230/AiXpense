import { connectDB } from "@/lib/db";
import { AiUsage } from "@/models";

const PRICING: Record<string, { input: number; output: number }> = {
  "gpt-5-mini": { input: 0.25, output: 2.0 },
  "gpt-5.1": { input: 1.25, output: 10.0 },
};

function calcCost(
  modelName: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const pricing = PRICING[modelName] ?? { input: 0.25, output: 2.0 };
  return (
    (promptTokens / 1_000_000) * pricing.input +
    (completionTokens / 1_000_000) * pricing.output
  );
}

export async function recordAiUsage({
  userId,
  userEmail,
  modelName,
  promptTokens,
  completionTokens,
}: {
  userId: string;
  userEmail: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
}) {
  try {
    await connectDB();
    await AiUsage.create({
      userId,
      userEmail,
      model: modelName,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      costUsd: calcCost(modelName, promptTokens, completionTokens),
    });
  } catch (e) {
    console.error("[recordAiUsage]", e);
  }
}
