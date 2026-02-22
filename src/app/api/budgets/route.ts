import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Budget, Expense } from "@/models";
import mongoose from "mongoose";
import { z } from "zod";
import { CATEGORIES } from "@/constants/expense";

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const userId = new mongoose.Types.ObjectId(session.user.id);
  const { start, end } = getMonthRange();

  const [budgets, spendAgg] = await Promise.all([
    Budget.find({ userId }).lean(),
    Expense.aggregate([
      {
        $match: {
          userId,
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: "$category", spent: { $sum: "$amount" } } },
    ]),
  ]);

  const spendMap = new Map<string, number>(
    spendAgg.map((s) => [s._id as string, s.spent as number]),
  );

  const result = budgets.map((b) => ({
    _id: b._id,
    category: b.category,
    amount: b.amount,
    spent: spendMap.get(b.category) ?? 0,
  }));

  return NextResponse.json(result);
}

const createSchema = z.object({
  category: z.enum(CATEGORIES),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDB();

  const userId = new mongoose.Types.ObjectId(session.user.id);
  const { category, amount } = parsed.data;

  const budget = await Budget.findOneAndUpdate(
    { userId, category },
    { amount },
    { upsert: true, returnDocument: "after" },
  );

  return NextResponse.json(budget);
}
