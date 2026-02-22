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

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "overview";
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

  if (type === "overview") {
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(
      prevEnd.getFullYear(),
      prevEnd.getMonth() -
        (range === "1m" ? 1 : range === "3m" ? 3 : range === "6m" ? 6 : 12),
      1,
    );

    const [curr, prev] = await Promise.all([
      Expense.aggregate([
        { $match: { ...baseMatch } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
            maxAmount: { $max: "$amount" },
            maxItem: { $max: { amount: "$amount", item: "$item" } },
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
    ]);

    const topCategory = await Expense.aggregate([
      { $match: { ...baseMatch } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    const currTotal = curr[0]?.total ?? 0;
    const prevTotal = prev[0]?.total ?? 0;
    const change =
      prevTotal > 0 ? ((currTotal - prevTotal) / prevTotal) * 100 : 0;

    return NextResponse.json({
      total: currTotal,
      count: curr[0]?.count ?? 0,
      change: Math.round(change * 10) / 10,
      topCategory: topCategory[0]?._id ?? null,
      topCategoryAmount: topCategory[0]?.total ?? 0,
      largestExpense: curr[0]?.maxAmount ?? 0,
    });
  }

  if (type === "trend") {
    const groupBy =
      range === "1m"
        ? {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          }
        : { year: { $year: "$date" }, month: { $month: "$date" } };

    const data = await Expense.aggregate([
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

    return NextResponse.json(data);
  }

  if (type === "categories") {
    const data = await Expense.aggregate([
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

    return NextResponse.json(data);
  }

  if (type === "budget-vs-actual") {
    const [budgets, actuals] = await Promise.all([
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
    ]);

    const spentMap = Object.fromEntries(
      actuals.map((a) => [a._id as string, a.spent as number]),
    );

    const result = budgets.map((b) => ({
      category: b.category,
      budget: b.amount,
      spent: spentMap[b.category] ?? 0,
    }));

    return NextResponse.json(result);
  }

  if (type === "top-expenses") {
    const data = await Expense.find({ ...baseMatch })
      .sort({ amount: -1 })
      .limit(8)
      .select("item amount category date")
      .lean();

    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
