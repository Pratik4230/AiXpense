import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { razorpay } from "@/lib/razorpay/client";
import { getOrCreateCustomer } from "@/lib/razorpay/customer";
import { Subscription } from "@/models/Subscription";
import { PlanType } from "@/lib/razorpay/plans";

const PLAN_IDS = {
  monthly: process.env.RAZORPAY_PLAN_ID_MONTHLY!,
  yearly: process.env.RAZORPAY_PLAN_ID_YEARLY!,
};

export async function POST(req: NextRequest) {
  console.log("[Create Subscription] Request received");
  try {
    console.log("[Create Subscription] Getting session...");
    const session = await auth.api.getSession({ headers: await headers() });
    console.log("[Create Subscription] Session:", {
      hasUser: !!session?.user,
      userId: session?.user?.id,
    });
    if (!session?.user) {
      console.log("[Create Subscription] Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    console.log("[Create Subscription] Plan:", plan);

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      console.log("[Create Subscription] Invalid plan");
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planType = plan as PlanType;
    const planId = PLAN_IDS[planType];
    console.log("[Create Subscription] Plan ID:", planId);

    if (!planId) {
      console.log("[Create Subscription] Plan ID not configured");
      return NextResponse.json(
        { error: "Plan ID not configured" },
        { status: 500 },
      );
    }

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

    console.log("[Create Subscription] Getting customer...");
    const customer = await getOrCreateCustomer(
      session.user.id,
      session.user.email,
      session.user.name,
    );
    console.log("[Create Subscription] Customer ID:", customer.id);

    interface RazorpaySubscriptionResponse {
      id: string;
      status: string;
      current_start: number;
      current_end: number;
      short_url: string;
    }

    console.log("[Create Subscription] Creating Razorpay subscription...");
    const subscriptionResponse = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customer.id,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: session.user.id,
      },
    } as never);

    const subscription =
      subscriptionResponse as unknown as RazorpaySubscriptionResponse;
    console.log("[Create Subscription] Subscription created:", subscription.id);

    const currentPeriodStart = new Date(subscription.current_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_end * 1000);

    await Subscription.create({
      userId: session.user.id,
      plan: planType,
      status: subscription.status,
      razorpaySubscriptionId: subscription.id,
      razorpayCustomerId: customer.id,
      razorpayPlanId: planId,
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      paymentUrl: subscription.short_url,
    });
  } catch (error) {
    console.error("[Create Subscription] ERROR:", error);
    console.error(
      "[Create Subscription] Error details:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "[Create Subscription] Stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    return NextResponse.json(
      {
        error: "Failed to create subscription",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
