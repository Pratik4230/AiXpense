import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { coachInsightEmail } from "@/lib/email/templates";
import { Expense, Insight } from "@/models";
import { chatModel } from "@/lib/ai/models";
import { generateText } from "ai";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";
import { cron } from "inngest";
import { getCurrency } from "@/constants/currency";
import { resolveUserCurrencyCode } from "@/lib/userCurrency";
import { formatInsightPeriodKey } from "@/lib/utcDates";

function getPeriodRange(type: "weekly" | "monthly") {
  const now = new Date();
  if (type === "weekly") {
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);
    const isoWeekStart = prevMonday.toISOString().slice(0, 10);
    return {
      start: prevMonday,
      end: monday,
      periodKey: `week-${isoWeekStart}`,
      label: formatInsightPeriodKey(`week-${isoWeekStart}`, "en"),
    };
  }
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const firstOfThisMonth = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
  const firstOfLastMonth = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const monthKey = firstOfLastMonth.toISOString().slice(0, 7);
  return {
    start: firstOfLastMonth,
    end: firstOfThisMonth,
    periodKey: `month-${monthKey}`,
    label: formatInsightPeriodKey(`month-${monthKey}`, "en"),
  };
}

async function runCoachForPeriod(type: "weekly" | "monthly") {
  const { start, end, periodKey, label } = getPeriodRange(type);

  await connectDB();

  const users = await db
    .collection("user")
    .find({
      emailVerified: true,
      isPremium: true,
    })
    .project({ _id: 1, email: 1, name: 1, currency: 1 })
    .toArray();

  const results = { sent: 0, skipped: 0 };

  for (const user of users) {
    const userId = user._id.toString();
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const existing = await Insight.findOne({
      userId: userObjectId,
      periodKey,
    }).lean();
    if (existing) {
      results.skipped++;
      continue;
    }

    const [stats] = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          byCategory: { $push: { category: "$category", amount: "$amount" } },
          biggest: { $max: "$amount" },
        },
      },
    ]);

    if (!stats || stats.count < 5) {
      results.skipped++;
      continue;
    }

    const categoryMap: Record<string, number> = {};
    for (const e of stats.byCategory) {
      categoryMap[e.category] = (categoryMap[e.category] ?? 0) + e.amount;
    }
    const userCurrency = getCurrency(resolveUserCurrencyCode(user.currency));
    const sym = userCurrency.symbol;

    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: ${sym}${amt.toFixed(0)}`)
      .join(", ");

    let text: string;
    let usage: Awaited<ReturnType<typeof generateText>>["usage"];
    try {
      ({ text, usage } = await generateText({
        model: chatModel(),
        providerOptions: {
          openai: {
            serviceTier: "flex",
            store: false,
          },
        },
        messages: [
          {
            role: "system",
            content:
              "You are a warm, encouraging personal finance coach. Analyse the user's spending data and write a friendly, easy-to-read summary. The user message states totals using their own currency symbol—keep that framing; do not switch to another currency. Acknowledge their efforts, highlight any patterns worth noting, and close with one specific, practical tip they can act on this week. Be conversational and supportive. Do not use bullet points, dashes (-- or -), em-dashes, or harsh judgements. Write in plain flowing sentences only.",
          },
          {
            role: "user",
            content: `My ${label} spending:\nTotal: ${sym}${stats.total.toFixed(0)}\nTop categories: ${topCategories}\nBiggest expense: ${sym}${stats.biggest.toFixed(0)}\nTotal transactions: ${stats.count}`,
          },
        ],
      }));
    } catch (e) {
      logger.error("inngest_coach_complete", {
        userId,
        error: e,
        data: { type, periodKey, reason: "openai_error" },
      });
      results.skipped++;
      continue;
    }

    const tokensUsed = (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0);

    await Insight.create({
      userId: userObjectId,
      periodKey,
      content: text,
      tokensUsed,
      totalSpent: stats.total,
      generatedAt: new Date(),
    });

    const { html, emailText } = (() => {
      const r = coachInsightEmail({
        name: user.name,
        insight: text,
        period: label,
        totalSpent: stats.total,
        currency: userCurrency.code,
      });
      return { html: r.html, emailText: r.text };
    })();

    await sendEmail({
      to: user.email,
      subject: `Your ${label} spending summary`,
      html,
      text: emailText,
    });

    results.sent++;
  }

  logger.info("inngest_coach_complete", {
    data: { type, periodKey, ...results },
  });
  return results;
}

export const aiCoachWeekly = inngest.createFunction(
  { id: "ai-coach-weekly", triggers: [cron("30 3 * * 1")] },
  async ({ step }) => {
    return step.run("run-weekly-coach", async () => {
      await connectDB();
      return runCoachForPeriod("weekly");
    });
  },
);

export const aiCoachMonthly = inngest.createFunction(
  { id: "ai-coach-monthly", triggers: [cron("30 2 1 * *")] },
  async ({ step }) => {
    return step.run("run-monthly-coach", async () => {
      await connectDB();
      return runCoachForPeriod("monthly");
    });
  },
);
