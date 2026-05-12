import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { razorpay } from "@/lib/razorpay/client";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/models";
import { PlanType } from "@/lib/razorpay/plans";
import { logger } from "@/lib/logger";

const PLAN_IDS = {
  monthly: process.env.RAZORPAY_PLAN_ID_MONTHLY!,
  yearly: process.env.RAZORPAY_PLAN_ID_YEARLY!,
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planType = plan as PlanType;
    const planId = PLAN_IDS[planType];

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID not configured" },
        { status: 500 },
      );
    }

    await connectDB();

    const existingSub = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
    });

    if (existingSub) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 },
      );
    }

    interface RazorpaySubscriptionResponse {
      id: string;
      status: string;
      current_start: number;
      current_end: number;
      short_url: string;
      customer_id?: string;
    }

    const subscriptionResponse = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notify_info: {
        notify_email: session.user.email,
      },
      notes: {
        userId: session.user.id,
        customer_name: session.user.name,
        customer_email: session.user.email,
      },
    } as never);

    const subscription =
      subscriptionResponse as unknown as RazorpaySubscriptionResponse;

    const currentPeriodStart = new Date(subscription.current_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_end * 1000);

    await Subscription.create({
      userId: session.user.id,
      billingProvider: "razorpay",
      plan: planType,
      status: subscription.status,
      razorpaySubscriptionId: subscription.id,
      razorpayCustomerId: subscription.customer_id || "",
      razorpayPlanId: planId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
    });

    logger.info("razorpay_sub_created", {
      userId: session.user.id,
      data: { plan: planType, subscriptionId: subscription.id },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      paymentUrl: subscription.short_url,
    });
  } catch (error) {
    logger.error("razorpay_sub_create_fail", { error });
    return NextResponse.json(
      {
        error: "Failed to create subscription",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
