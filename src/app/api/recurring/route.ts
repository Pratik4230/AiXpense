import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { RecurringPayment } from "@/models";
import { CATEGORIES, EXPENSE_TYPES, FREQUENCIES } from "@/constants/expense";
import { getInitialNextDueDate } from "@/lib/recurring";
import mongoose from "mongoose";
import { z } from "zod";
import { fetchUserCurrencyCodeFromDb } from "@/lib/userCurrencyFromDb";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  category: z.enum(CATEGORIES),
  type: z.enum(EXPENSE_TYPES),
  frequency: z.enum(FREQUENCIES),
  recurOnDate: z.number().int().min(1).max(28).optional(),
  startDate: z.union([z.iso.datetime(), z.iso.date()]).pipe(z.coerce.date()),
  notes: z.string().max(500).optional(),
});

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") !== "false";

  await connectDB();
  const uid = new mongoose.Types.ObjectId(session.user.id);

  const filter: Record<string, unknown> = { userId: uid };
  if (activeOnly) filter.isActive = true;

  const data = await RecurringPayment.find(filter)
    .sort({ nextDueDate: 1 })
    .lean();

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const {
    name,
    amount,
    category,
    type,
    frequency,
    recurOnDate,
    startDate,
    notes,
  } = parsed.data;

  const nextDueDate = getInitialNextDueDate(startDate, frequency, recurOnDate);

  await connectDB();
  const uid = new mongoose.Types.ObjectId(session.user.id);
  const currency = await fetchUserCurrencyCodeFromDb(session.user.id);

  const doc = await RecurringPayment.create({
    userId: uid,
    name,
    amount,
    currency,
    category,
    type,
    frequency,
    recurOnDate,
    startDate,
    nextDueDate,
    isActive: true,
    notes,
  });

  return NextResponse.json({ data: doc }, { status: 201 });
}
