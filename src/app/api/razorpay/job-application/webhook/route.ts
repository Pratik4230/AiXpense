import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { JobApplication } from "@/models";

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const receivedSignature = request.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!receivedSignature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
  if (!signaturesMatch(expectedSignature, receivedSignature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(body);
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    if (!orderId) return NextResponse.json({ received: true });

    await connectDB();
    if (event.event === "payment.captured") {
      const application = await JobApplication.findOne({ "payment.orderId": orderId });
      if (!application) return NextResponse.json({ received: true });
      if (payment.amount !== application.payment.amountInPaise || payment.currency !== application.payment.currency) {
        console.error("[job-application-payment-webhook] Payment amount mismatch", { orderId });
        return NextResponse.json({ received: true });
      }
      const result = await JobApplication.updateOne(
        { "payment.orderId": orderId, "payment.amountInPaise": payment.amount, "payment.currency": payment.currency },
        { $set: { "payment.status": "paid", "payment.paymentId": payment.id, "payment.paidAt": new Date() } },
      );
      if (result.matchedCount) {
        await inngest.send({
          name: "careers/job-application-paid",
          data: { applicationId: application.id },
        });
      }
    } else if (event.event === "payment.failed") {
      await JobApplication.updateOne(
        { "payment.orderId": orderId, "payment.status": { $ne: "paid" } },
        { $set: { "payment.status": "failed", "payment.paymentId": payment.id } },
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[job-application-payment-webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
