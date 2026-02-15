import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Subscription } from "@/models/Subscription";
import { updateUserPremiumFlag } from "@/lib/razorpay/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const { payload } = event;

    console.log("Razorpay webhook event:", event.event);

    switch (event.event) {
      case "subscription.activated": {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (!userId) {
          console.error("No userId in subscription notes");
          return NextResponse.json(
            { error: "Missing userId" },
            { status: 400 },
          );
        }

        await Subscription.updateOne(
          { razorpaySubscriptionId: subscription.id },
          {
            $set: {
              status: "active",
              currentPeriodStart: new Date(subscription.current_start * 1000),
              currentPeriodEnd: new Date(subscription.current_end * 1000),
            },
          },
        );

        await updateUserPremiumFlag(userId, true);

        console.log(`Activated subscription for user ${userId}`);
        break;
      }

      case "subscription.charged": {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          await Subscription.updateOne(
            { razorpaySubscriptionId: subscription.id },
            {
              $set: {
                status: "active",
                currentPeriodStart: new Date(subscription.current_start * 1000),
                currentPeriodEnd: new Date(subscription.current_end * 1000),
              },
            },
          );

          await updateUserPremiumFlag(userId, true);
          console.log(`Renewed subscription for user ${userId}`);
        }
        break;
      }

      case "subscription.cancelled": {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          await Subscription.updateOne(
            { razorpaySubscriptionId: subscription.id },
            { $set: { status: "cancelled", cancelAtPeriodEnd: true } },
          );

          await updateUserPremiumFlag(userId, false);
          console.log(`Cancelled subscription for user ${userId}`);
        }
        break;
      }

      case "subscription.paused":
      case "subscription.halted": {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          await Subscription.updateOne(
            { razorpaySubscriptionId: subscription.id },
            { $set: { status: "past_due" } },
          );

          await updateUserPremiumFlag(userId, false);
          console.log(`Subscription past due for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
