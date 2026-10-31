import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { careerRoles } from "@/components/careers/data";
import { connectDB } from "@/lib/db";
import { razorpay } from "@/lib/razorpay/client";
import { JobApplication } from "@/models";
import { applicationFormSchema } from "@/lib/careers/applicationSchema";

const APPLICATION_AMOUNT_IN_PAISE = 10000;

const experienceMap = {
  Fresher: "fresher",
  "Less than 1 year": "less_than_1_year",
  "1 to 2 years": "1_to_2_years",
} as const;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function requestFingerprint(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return crypto.createHash("sha256").update(`${ip}|${userAgent}|${process.env.MONGO_URI}`).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = applicationFormSchema.safeParse({
      ...body,
      remoteTimezoneConfirmed: body.remoteTimezoneConfirmed === true,
      contactConsent: body.contactConsent === true,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the application fields" }, { status: 400 });
    }

    const values = parsed.data;
    const roleId = values.roleId;
    const role = careerRoles.find((item) => item.id === roleId);
    const experienceValue = values.experience;
    const experience = experienceValue
      ? experienceMap[experienceValue as keyof typeof experienceMap]
      : undefined;

    if (!role || !experience) {
      return NextResponse.json({ error: "Invalid role or experience" }, { status: 400 });
    }

    const { fullName, email, phone, location, resume: resumeUrl, github: githubUrl, availability, salary: expectedSalary, bestProject, skillsUsed, technicalProblem, whyAiXpense } = values;

    if (values.website) {
      return NextResponse.json({ error: "Unable to submit this application" }, { status: 400 });
    }

    if (!isValidUrl(resumeUrl) || !isValidUrl(githubUrl)) return NextResponse.json({ error: "Please provide valid resume and GitHub links" }, { status: 400 });

    await connectDB();
    const fingerprint = requestFingerprint(request);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [duplicateApplication, recentEmailAttempts, recentFingerprintAttempts] = await Promise.all([
      JobApplication.exists({ email, roleId: role.id, createdAt: { $gte: thirtyDaysAgo } }),
      JobApplication.countDocuments({ email, createdAt: { $gte: oneHourAgo } }),
      JobApplication.countDocuments({ requestFingerprint: fingerprint, createdAt: { $gte: oneHourAgo } }),
    ]);

    if (duplicateApplication) {
      return NextResponse.json({ error: "You have already applied for this role recently. You can apply again after 30 days." }, { status: 409 });
    }

    if (recentEmailAttempts >= 3 || recentFingerprintAttempts >= 5) {
      return NextResponse.json({ error: "Too many application attempts. Please try again later." }, { status: 429 });
    }

    const application = await JobApplication.create({
      roleId: role.id,
      roleTitle: role.title,
      fullName,
      email,
      phone,
      location,
      experience,
      resumeUrl,
      githubUrl,
      answers: { bestProject, skillsUsed, technicalProblem, whyAiXpense },
      availability,
      expectedSalary,
      remoteTimezoneConfirmed: true,
      contactConsent: true,
      requestFingerprint: fingerprint,
      status: "pending",
      payment: {
        status: "pending",
        amountInPaise: APPLICATION_AMOUNT_IN_PAISE,
        currency: "INR",
        provider: "razorpay",
      },
    });

    try {
      const order = await razorpay.orders.create({
        amount: APPLICATION_AMOUNT_IN_PAISE,
        currency: "INR",
        receipt: `jobapp_${application.id}`,
        notes: { applicationId: application.id, roleId: role.id },
      });

      await JobApplication.updateOne(
        { _id: application._id },
        { $set: { "payment.orderId": order.id } },
      );

      return NextResponse.json({
        applicationId: application.id,
        orderId: order.id,
        amount: APPLICATION_AMOUNT_IN_PAISE,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      await JobApplication.deleteOne({ _id: application._id });
      throw error;
    }
  } catch (error) {
    console.error("[job-application-order]", error);
    return NextResponse.json({ error: "Unable to start the application payment" }, { status: 500 });
  }
}
