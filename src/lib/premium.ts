import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

export type PremiumFields = {
  isPremium?: boolean | null;
};

export function effectivePremium(user: PremiumFields): boolean {
  return user.isPremium === true;
}

export async function hasPremiumAccess(userId: string): Promise<boolean> {
  await connectDB();
  const user = await mongoose.connection.db!.collection("user").findOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    { projection: { isPremium: 1 } },
  );
  return effectivePremium({ isPremium: user?.isPremium as boolean | undefined });
}

export function premiumRequiredResponse() {
  return NextResponse.json(
    { error: "A Premium subscription is required to use AiXpense." },
    { status: 403 },
  );
}
