import { NextRequest, NextResponse } from "next/server";

import { careerRoles } from "@/components/careers/data";
import { connectDB } from "@/lib/db";
import { razorpay } from "@/lib/razorpay/client";
import { JobApplication } from "@/models";

const APPLICATION_AMOUNT_IN_PAISE = 10000;

const experienceMap = {
  Fresher: "fresher",
  "Less than 1 year": "less_than_1_year",
  "1 to 2 years": "1_to_2_years",
} as const;

function requiredString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const roleId = requiredString(body.roleId);
    const role = careerRoles.find((item) => item.id === roleId);
    const experienceValue = requiredString(body.experience);
    const experience = experienceValue
      ? experienceMap[experienceValue as keyof typeof experienceMap]
      : undefined;

    if (!role || !experience) {
      return NextResponse.json({ error: "Invalid role or experience" }, { status: 400 });
    }

    const fullName = requiredString(body.fullName);
    const email = requiredString(body.email)?.toLowerCase();
    const phone = requiredString(body.phone);
    const location = requiredString(body.location);
    const resumeUrl = requiredString(body.resume);
    const githubUrl = requiredString(body.github);
    const availability = requiredString(body.availability);
    const expectedSalary = requiredString(body.salary);
    const bestProject = requiredString(body.bestProject);
    const skillsUsed = requiredString(body.skillsUsed);
    const technicalProblem = requiredString(body.technicalProblem);
    const whyAiXpense = requiredString(body.whyAiXpense);

    if (!fullName || !email || !phone || !location || !resumeUrl || !githubUrl || !availability || !expectedSalary || !bestProject || !skillsUsed || !technicalProblem || !whyAiXpense) {
      return NextResponse.json({ error: "Please complete all required fields" }, { status: 400 });
    }

    if (body.remoteTimezoneConfirmed !== true || body.contactConsent !== true) {
      return NextResponse.json({ error: "Please confirm the required consent items" }, { status: 400 });
    }

    await connectDB();
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
