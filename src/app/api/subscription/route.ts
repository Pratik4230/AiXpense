import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/models";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sub = await Subscription.findOne({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  if (!sub) return NextResponse.json(null);

  return NextResponse.json({
    status: sub.status,
    plan: sub.plan,
    billingProvider: sub.billingProvider ?? "razorpay",
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
  });
}
