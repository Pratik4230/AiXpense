"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/models";
import { razorpay } from "@/lib/razorpay/client";

export async function updateName(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name: name.trim() },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: "Failed to update name" };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword, revokeOtherSessions: true },
    });
    return { success: true };
  } catch {
    return { error: "Current password is incorrect" };
  }
}

export async function deleteAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {} as { callbackURL?: string; password?: string; token?: string },
    });
    return { success: true };
  } catch {
    return { error: "Failed to delete account" };
  }
}

export async function getSubscription() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  await connectDB();
  const sub = await Subscription.findOne({ userId: session.user.id }).sort({
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

export async function getSessions() {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) return { sessions: [], currentSessionId: "" };

  const result = await auth.api.listSessions({ headers: hdrs });
  const currentSessionId = session.session.id;

  const sessions = result.map((s) => ({
    id: s.id,
    ipAddress: s.ipAddress ?? null,
    userAgent: s.userAgent ?? null,
    createdAt: s.createdAt.toISOString(),
    isCurrent: s.id === currentSessionId,
  }));

  return { sessions, currentSessionId };
}
