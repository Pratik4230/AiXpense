import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";

function getDateRange(range: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const end = new Date(Date.UTC(year, month, now.getUTCDate(), 23, 59, 59, 999));
  const start = new Date(Date.UTC(year, month, 1));

  if (range === "3m") start.setUTCMonth(month - 2);
  if (range === "6m") start.setUTCMonth(month - 5);
  if (range === "1y") {
    start.setUTCMonth(0);
  }

  return { start, end };
}

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = new URL(req.url).searchParams;
  const range = params.get("range") ?? "1m";
  const mode = params.get("mode") === "income" ? "income" : "expense";
  if (!["1m", "3m", "6m", "1y"].includes(range)) {
    return NextResponse.json({ error: "Invalid report range" }, { status: 400 });
  }

  await connectDB();
  const { start, end } = getDateRange(range);
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const expenses = await Expense.find({ userId, type: mode, date: { $gte: start, $lte: end } })
    .sort({ date: -1 })
    .select("date item amount currency category subcategory tags notes type")
    .lean();

  const columns = ["Date", "Type", "Item", "Amount", "Currency", "Category", "Subcategory", "Tags", "Notes"];
  const rows = expenses.map((expense) => [
    expense.date,
    expense.type,
    expense.item,
    expense.amount,
    expense.currency,
    expense.category,
    expense.subcategory,
    expense.tags?.join(", "),
    expense.notes,
  ]);
  const csv = [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const filename = `aixpense-${mode}-${range}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(`\uFEFF${csv}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
