import { connectDB } from "@/lib/db";
import { AiUsage } from "@/models";
import { logger } from "@/lib/logger";

const PRICING: Record<
  string,
  { input: number; cachedInput: number; output: number }
> = {
  "gpt-5.2": { input: 1.75, cachedInput: 0.175, output: 14.0 },
  "gpt-5.1": { input: 1.25, cachedInput: 0.125, output: 10.0 },
  "gpt-5": { input: 1.25, cachedInput: 0.125, output: 10.0 },
  "gpt-5-mini": { input: 0.25, cachedInput: 0.025, output: 2.0 },
  "gpt-5-nano": { input: 0.05, cachedInput: 0.005, output: 0.4 },
};

function calcCost(
  modelName: string,
  promptTokens: number,
  completionTokens: number,
  cachedTokens = 0,
): number {
  const pricing = PRICING[modelName] ?? {
    input: 0.25,
    cachedInput: 0.025,
    output: 2.0,
  };
  const nonCachedTokens = Math.max(0, promptTokens - cachedTokens);
  return (
    (nonCachedTokens / 1_000_000) * pricing.input +
    (cachedTokens / 1_000_000) * pricing.cachedInput +
    (completionTokens / 1_000_000) * pricing.output
  );
}

export async function recordAiUsage({
  userId,
  userEmail,
  modelName,
  promptTokens,
  completionTokens,
  cachedTokens = 0,
}: {
  userId: string;
  userEmail: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  cachedTokens?: number;
}) {
  try {
    await connectDB();
    await AiUsage.create({
      userId,
      userEmail,
      model: modelName,
      promptTokens,
      cachedTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      costUsd: calcCost(
        modelName,
        promptTokens,
        completionTokens,
        cachedTokens,
      ),
    });
  } catch (e) {
    logger.error("ai_usage_record_fail", { userId, error: e });
  }
}
