import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Insight } from "@/models";
import mongoose from "mongoose";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const insight = await Insight.findOne({
    userId: new mongoose.Types.ObjectId(session.user.id),
  })
    .sort({ generatedAt: -1 })
    .lean();

  if (!insight) return NextResponse.json(null);

  return NextResponse.json({
    id: insight._id.toString(),
    periodKey: insight.periodKey,
    content: insight.content,
    totalSpent: insight.totalSpent,
    generatedAt: insight.generatedAt,
  });
}
