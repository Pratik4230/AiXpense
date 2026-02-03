"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Expense } from "@/lib/models";

export async function deleteTransaction(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const transaction = await Expense.findOne({
    _id: id,
    userId: session.user.id,
  });

  if (!transaction) {
    return { error: "Transaction not found" };
  }

  await Expense.deleteOne({ _id: id });

  return { success: true };
}

export async function updateTransaction(
  id: string,
  data: {
    item?: string;
    amount?: number;
    category?: string;
    subcategory?: string;
  },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const transaction = await Expense.findOne({
    _id: id,
    userId: session.user.id,
  });

  if (!transaction) {
    return { error: "Transaction not found" };
  }

  await Expense.findByIdAndUpdate(id, { $set: data }, { new: true });

  return { success: true };
}
