import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { coachInsightEmail } from "@/lib/email/templates";
import { Expense, Insight, AiUsage } from "@/models";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import mongoose from "mongoose";

function getPeriodRange(type: "weekly" | "monthly") {
  const now = new Date();
  if (type === "weekly") {
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);
    return {
      start: prevMonday,
      end: monday,
      periodKey: `week-${prevMonday.toISOString().slice(0, 10)}`,
      label: `Week of ${prevMonday.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
    };
  }
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return {
    start: firstOfLastMonth,
    end: firstOfThisMonth,
    periodKey: `month-${firstOfLastMonth.toISOString().slice(0, 7)}`,
    label: firstOfLastMonth.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    }),
  };
}

async function runCoachForPeriod(type: "weekly" | "monthly") {
  const { start, end, periodKey, label } = getPeriodRange(type);

  const users = await db
    .collection("user")
    .find({ isPremium: true, emailVerified: true })
    .project({ _id: 1, email: 1, name: 1 })
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

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCost = await AiUsage.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: monthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$costUsd" } } },
    ]);
    const costThisMonth = monthlyCost[0]?.total ?? 0;
    if (costThisMonth > 0.1) {
      results.skipped++;
      continue;
    }

    const categoryMap: Record<string, number> = {};
    for (const e of stats.byCategory) {
      categoryMap[e.category] = (categoryMap[e.category] ?? 0) + e.amount;
    }
    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(0)}`)
      .join(", ");

    const { text, usage } = await generateText({
      model: openai("gpt-5-mini"),
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
            "You are a warm, encouraging personal finance coach. Analyse the user's spending data and write a friendly, easy-to-read summary. Acknowledge their efforts, highlight any patterns worth noting, and close with one specific, practical tip they can act on this week. Be conversational and supportive — no bullet points, no harsh judgements.",
        },
        {
          role: "user",
          content: `My ${label} spending:\nTotal: ₹${stats.total.toFixed(0)}\nTop categories: ${topCategories}\nBiggest expense: ₹${stats.biggest.toFixed(0)}\nTotal transactions: ${stats.count}`,
        },
      ],
    });

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

  return results;
}

export const aiCoachWeekly = inngest.createFunction(
  { id: "ai-coach-weekly" },
  { cron: "30 3 * * 1" },
  async ({ step }) => {
    return step.run("run-weekly-coach", async () => {
      await connectDB();
      return runCoachForPeriod("weekly");
    });
  },
);

export const aiCoachMonthly = inngest.createFunction(
  { id: "ai-coach-monthly" },
  { cron: "30 2 1 * *" },
  async ({ step }) => {
    return step.run("run-monthly-coach", async () => {
      await connectDB();
      return runCoachForPeriod("monthly");
    });
  },
);
