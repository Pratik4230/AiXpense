import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import mongoose from "mongoose";

const LIMIT = 20;

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const type = searchParams.get("type") ?? "all";
  const categories =
    searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");
  const sort = searchParams.get("sort") ?? "date";
  const order = searchParams.get("order") === "asc" ? 1 : -1;

  await connectDB();
  const uid = new mongoose.Types.ObjectId(session.user.id);

  const match: Record<string, unknown> = { userId: uid };

  if (type !== "all") match.type = type;
  if (categories.length > 0) match.category = { $in: categories };

  const dateFilter: Record<string, Date> = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    dateFilter.$lte = toDate;
  }
  if (Object.keys(dateFilter).length > 0) match.date = dateFilter;

  const amountFilter: Record<string, number> = {};
  if (minAmount) amountFilter.$gte = parseFloat(minAmount);
  if (maxAmount) amountFilter.$lte = parseFloat(maxAmount);
  if (Object.keys(amountFilter).length > 0) match.amount = amountFilter;

  const sortKey = ["date", "amount", "category"].includes(sort) ? sort : "date";
  const sortObj = { [sortKey]: order } as Record<string, 1 | -1>;

  const [data, total] = await Promise.all([
    Expense.find(match)
      .sort(sortObj)
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .select("item amount currency category type date")
      .lean(),
    Expense.countDocuments(match),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    hasMore: page * LIMIT < total,
    nextPage: page * LIMIT < total ? page + 1 : null,
  });
}
