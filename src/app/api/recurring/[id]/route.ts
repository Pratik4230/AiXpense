import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { RecurringPayment } from "@/models";
import { CATEGORIES, EXPENSE_TYPES, FREQUENCIES } from "@/constants/expense";
import { getInitialNextDueDate } from "@/lib/recurring";
import mongoose from "mongoose";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  amount: z.number().positive().optional(),
  category: z.enum(CATEGORIES).optional(),
  type: z.enum(EXPENSE_TYPES).optional(),
  frequency: z.enum(FREQUENCIES).optional(),
  recurOnDate: z.number().int().min(1).max(28).nullable().optional(),
  startDate: z.union([z.iso.datetime(), z.iso.date()]).pipe(z.coerce.date()).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function resolveOwned(id: string, userId: mongoose.Types.ObjectId) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return RecurringPayment.findOne({ _id: id, userId });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();
  const uid = new mongoose.Types.ObjectId(session.user.id);
  const doc = await resolveOwned(id, uid);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updates = { ...parsed.data } as Record<string, unknown>;

  if (parsed.data.startDate || parsed.data.frequency || parsed.data.recurOnDate !== undefined) {
    const start = parsed.data.startDate ?? doc.startDate;
    const freq = parsed.data.frequency ?? doc.frequency;
    const recurOnDate =
      parsed.data.recurOnDate !== undefined ? parsed.data.recurOnDate ?? undefined : doc.recurOnDate;
    updates.nextDueDate = getInitialNextDueDate(start, freq, recurOnDate ?? undefined);
  }

  Object.assign(doc, updates);
  await doc.save();

  return NextResponse.json({ data: doc });
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const uid = new mongoose.Types.ObjectId(session.user.id);
  const doc = await resolveOwned(id, uid);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await doc.deleteOne();
  return NextResponse.json({ success: true });
}
