import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { razorpay } from "@/lib/razorpay/client";
import { JobApplication } from "@/models";

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const { applicationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();
    if (![applicationId, razorpayOrderId, razorpayPaymentId, razorpaySignature].every((value) => typeof value === "string" && value)) {
      return NextResponse.json({ error: "Incomplete payment verification data" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (!signaturesMatch(expectedSignature, razorpaySignature)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const payment = await razorpay.payments.fetch(razorpayPaymentId) as unknown as { order_id?: string; status?: string };
    if (payment.order_id !== razorpayOrderId || payment.status !== "captured") {
      return NextResponse.json({ error: "Payment has not been captured" }, { status: 400 });
    }

    await connectDB();
    const application = await JobApplication.findOne({ _id: applicationId, "payment.orderId": razorpayOrderId });
    if (!application) {
      return NextResponse.json({ error: "Application payment order not found" }, { status: 404 });
    }

    const result = await JobApplication.updateOne(
      { _id: applicationId, "payment.orderId": razorpayOrderId },
      {
        $set: {
          "payment.status": "paid",
          "payment.paymentId": razorpayPaymentId,
          "payment.paidAt": new Date(),
        },
      },
    );

    if (!result.matchedCount) return NextResponse.json({ error: "Application payment order not found" }, { status: 404 });

    await inngest.send({
      name: "careers/job-application-paid",
      data: { applicationId },
    });

    return NextResponse.json({ ok: true, applicationId, paymentId: razorpayPaymentId });
  } catch (error) {
    console.error("[job-application-payment-verify]", error);
    return NextResponse.json({ error: "Unable to verify payment" }, { status: 500 });
  }
}
