import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Expense, Budget } from "@/models";
import mongoose from "mongoose";

function getDateRange(range: string): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );
  let start: Date;

  switch (range) {
    case "3m":
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      break;
    case "6m":
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      break;
    case "1y":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { start, end };
}

function computeOverview(
  baseMatch: object,
  uid: mongoose.Types.ObjectId,
  range: string,
  mode: string,
  start: Date,
) {
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(
    prevEnd.getFullYear(),
    prevEnd.getMonth() -
      (range === "1m" ? 1 : range === "3m" ? 3 : range === "6m" ? 6 : 12),
    1,
  );

  return Promise.all([
    Expense.aggregate([
      { $match: { ...baseMatch } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          maxAmount: { $max: "$amount" },
        },
      },
    ]),
    Expense.aggregate([
      {
        $match: {
          userId: uid,
          type: mode,
          date: { $gte: prevStart, $lte: prevEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { ...baseMatch } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]),
  ]).then(([curr, prev, topCategory]) => {
    const currTotal = curr[0]?.total ?? 0;
    const prevTotal = prev[0]?.total ?? 0;
    const change =
      prevTotal > 0 ? ((currTotal - prevTotal) / prevTotal) * 100 : 0;

    return {
      total: currTotal,
      count: curr[0]?.count ?? 0,
      change: Math.round(change * 10) / 10,
      topCategory: topCategory[0]?._id ?? null,
      topCategoryAmount: topCategory[0]?.total ?? 0,
      largestExpense: curr[0]?.maxAmount ?? 0,
    };
  });
}

function computeTrend(baseMatch: object, range: string) {
  const groupBy =
    range === "1m"
      ? {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        }
      : { year: { $year: "$date" }, month: { $month: "$date" } };

  return Expense.aggregate([
    { $match: { ...baseMatch } },
    {
      $group: {
        _id: groupBy,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
  ]);
}

function computeCategories(baseMatch: object) {
  return Expense.aggregate([
    { $match: { ...baseMatch } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);
}

function computeBudgetVsActual(
  uid: mongoose.Types.ObjectId,
  start: Date,
  end: Date,
) {
  return Promise.all([
    Budget.find({ userId: uid }).lean(),
    Expense.aggregate([
      {
        $match: {
          userId: uid,
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: "$category", spent: { $sum: "$amount" } } },
    ]),
  ]).then(([budgets, actuals]) => {
    const spentMap = Object.fromEntries(
      actuals.map((a) => [a._id as string, a.spent as number]),
    );
    return budgets.map((b) => ({
      category: b.category,
      budget: b.amount,
      spent: spentMap[b.category] ?? 0,
    }));
  });
}

function computeTopExpenses(baseMatch: object) {
  return Expense.find({ ...baseMatch })
    .sort({ amount: -1 })
    .limit(8)
    .select("item amount category date")
    .lean();
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") ?? "1m";
  const mode = (searchParams.get("mode") ?? "expense") as "expense" | "income";

  await connectDB();
  const uid = new mongoose.Types.ObjectId(session.user.id);
  const { start, end } = getDateRange(range);

  const baseMatch = {
    userId: uid,
    date: { $gte: start, $lte: end },
    type: mode,
  };

  const [overview, trend, categories, budgetVsActual, topExpenses] =
    await Promise.all([
      computeOverview(baseMatch, uid, range, mode, start),
      computeTrend(baseMatch, range),
      computeCategories(baseMatch),
      mode === "expense" ? computeBudgetVsActual(uid, start, end) : null,
      computeTopExpenses(baseMatch),
    ]);

  return NextResponse.json({
    overview,
    trend,
    categories,
    budgetVsActual,
    topExpenses,
  });
}
