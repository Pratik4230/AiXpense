import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Subscription } from "@/models";
import { updateUserPremiumFlag } from "@/lib/razorpay/subscription";
import { sendEmail } from "@/lib/email";
import { paymentReceiptTemplate } from "@/lib/email/templates/paymentReceipt";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { RAZORPAY_PLANS } from "@/lib/razorpay/plans";

async function getUserEmail(
  userId: string,
): Promise<{ email: string; name: string } | null> {
  try {
    const user = await db
      .collection("user")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { email: 1, name: 1 } },
      );
    if (!user) return null;
    return { email: user.email, name: user.name || "there" };
  } catch {
    return null;
  }
}

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
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const { payload } = event;

    switch (event.event) {
      case "subscription.activated": {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (!userId) {
          return NextResponse.json(
            { error: "Missing userId" },
            { status: 400 },
          );
        }

        const planId = subscription.plan_id as string;
        const plan =
          planId === process.env.RAZORPAY_PLAN_ID_YEARLY ? "yearly" : "monthly";
        const periodStart = new Date(subscription.current_start * 1000);
        const periodEnd = new Date(subscription.current_end * 1000);

        await Subscription.updateOne(
          { razorpaySubscriptionId: subscription.id },
          {
            $set: {
              status: "active",
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
          },
        );

        await updateUserPremiumFlag(userId, true);

        const user = await getUserEmail(userId);
        if (user) {
          const { subject, html } = paymentReceiptTemplate({
            userName: user.name,
            plan,
            amount: RAZORPAY_PLANS[plan].amount / 100,
            paymentDate: periodStart,
            nextBillingDate: periodEnd,
            subscriptionId: subscription.id,
            isFirstPayment: true,
          });
          await sendEmail({ to: user.email, subject, html }).catch(() => {});
        }
        break;
      }

      case "subscription.charged": {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          const planId = subscription.plan_id as string;
          const plan =
            planId === process.env.RAZORPAY_PLAN_ID_YEARLY
              ? "yearly"
              : "monthly";
          const periodStart = new Date(subscription.current_start * 1000);
          const periodEnd = new Date(subscription.current_end * 1000);

          await Subscription.updateOne(
            { razorpaySubscriptionId: subscription.id },
            {
              $set: {
                status: "active",
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
              },
            },
          );

          await updateUserPremiumFlag(userId, true);

          const user = await getUserEmail(userId);
          if (user) {
            const { subject, html } = paymentReceiptTemplate({
              userName: user.name,
              plan,
              amount: RAZORPAY_PLANS[plan].amount / 100,
              paymentDate: periodStart,
              nextBillingDate: periodEnd,
              subscriptionId: subscription.id,
              isFirstPayment: false,
            });
            await sendEmail({ to: user.email, subject, html }).catch(() => {});
          }
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
        }
        break;
      }

      case "subscription.completed":
      case "subscription.expired": {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes?.userId;

        if (userId) {
          await Subscription.updateOne(
            { razorpaySubscriptionId: subscription.id },
            { $set: { status: "expired" } },
          );

          await updateUserPremiumFlag(userId, false);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
