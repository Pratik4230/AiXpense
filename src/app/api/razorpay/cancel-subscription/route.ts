import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { razorpay } from "@/lib/razorpay/client";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/models";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const subscription = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
      cancelAtPeriodEnd: false,
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    if (subscription.billingProvider === "dodo") {
      return NextResponse.json(
        {
          error:
            "International subscriptions are managed in the Dodo billing portal.",
        },
        { status: 400 },
      );
    }

    const rpId = subscription.razorpaySubscriptionId;
    if (!rpId) {
      return NextResponse.json(
        { error: "No Razorpay subscription id on record" },
        { status: 400 },
      );
    }

    await razorpay.subscriptions.cancel(rpId, false);

    await Subscription.updateOne(
      { _id: subscription._id },
      { $set: { cancelAtPeriodEnd: true } },
    );

    logger.info("razorpay_sub_cancelled", {
      userId: session.user.id,
      data: { subscriptionId: rpId },
    });

    return NextResponse.json({
      success: true,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error) {
    logger.error("razorpay_sub_cancel_fail", { error });
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
