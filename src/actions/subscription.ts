"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/models";
import { razorpay } from "@/lib/razorpay/client";

export async function getSubscription(userId?: string) {
  let uid = userId;
  if (!uid) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    uid = session.user.id;
  }

  await connectDB();
  const sub = await Subscription.findOne({ userId: uid }).sort({
    createdAt: -1,
  });

  if (!sub) return null;

  return {
    status: sub.status as string,
    plan: sub.plan as string,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd as boolean,
    currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
  };
}

export async function cancelSubscription() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated" };

  try {
    await connectDB();

    const sub = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
      cancelAtPeriodEnd: false,
    });

    if (!sub) return { error: "No active subscription found" };

    const isTestSub = sub.razorpaySubscriptionId.startsWith("sub_TEST");

    if (!isTestSub) {
      await razorpay.subscriptions.cancel(sub.razorpaySubscriptionId, false);
    }

    await Subscription.updateOne(
      { _id: sub._id },
      { $set: { cancelAtPeriodEnd: true } },
    );

    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: "Failed to cancel subscription" };
  }
}
