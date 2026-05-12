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
    billingProvider: (sub.billingProvider ?? "razorpay") as
      | "razorpay"
      | "dodo",
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd as boolean,
    currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
  };
}

export async function getDodoBillingPortalUrl() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Not authenticated" as const };

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    (host ? `${proto}://${host}` : null);

  if (!base) {
    return { error: "App URL is not configured (NEXT_PUBLIC_APP_URL)" as const };
  }

  const portalPath = `${base}/api/auth/dodopayments/customer/portal`;
  const res = await fetch(portalPath, {
    method: "GET",
    headers: { cookie: h.get("cookie") ?? "" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      error: (text || `Portal request failed (${res.status})`) as string,
    };
  }

  const body = (await res.json()) as { url?: string };
  if (!body.url) return { error: "No portal URL returned" as const };
  return { url: body.url };
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

    if (sub.billingProvider === "dodo") {
      return {
        error:
          "International subscriptions are cancelled in the Dodo billing portal.",
        code: "DODO_PORTAL" as const,
      };
    }

    const rpId = sub.razorpaySubscriptionId;
    if (!rpId) return { error: "No Razorpay subscription id on record" };

    const isTestSub = rpId.startsWith("sub_TEST");

    if (!isTestSub) {
      await razorpay.subscriptions.cancel(rpId, false);
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
