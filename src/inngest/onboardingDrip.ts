import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import {
  welcomeEmail,
  nudgeDay1Email,
  nudgeDay3Email,
  nudgeDay7Email,
} from "@/lib/email/templates";
import { Expense } from "@/models";
import { db } from "@/lib/db";
import mongoose from "mongoose";

export const onboardingDrip = inngest.createFunction(
  { id: "onboarding-drip", retries: 0 },
  { event: "user/created" },
  async ({ event, step }) => {
    const { userId, email, name } = event.data;

    await step.sleep("wait-for-verification", "10m");

    const isVerified = await step.run("check-email-verified", async () => {
      await connectDB();
      const user = await db
        .collection("user")
        .findOne({ _id: new mongoose.Types.ObjectId(userId) });
      return user?.emailVerified === true;
    });

    if (!isVerified) return { skipped: "email not verified" };

    await step.run("send-welcome-email", async () => {
      const { html, text } = welcomeEmail({ name });
      await sendEmail({
        to: email,
        subject: "Welcome to AiXpense!",
        html,
        text,
      });
    });

    await step.sleep("wait-1-day", "1d");

    await step.run("nudge-day-1", async () => {
      await connectDB();
      const count = await Expense.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
      });
      if (count > 0) return { skipped: "has expenses" };

      const { html, text } = nudgeDay1Email({ name });
      await sendEmail({
        to: email,
        subject: "You haven't logged any expenses yet",
        html,
        text,
      });
    });

    await step.sleep("wait-2-days", "2d");

    await step.run("nudge-day-3", async () => {
      const { html, text } = nudgeDay3Email({ name });
      await sendEmail({
        to: email,
        subject: "Try voice-style input on AiXpense",
        html,
        text,
      });
    });

    await step.sleep("wait-4-days", "4d");

    await step.run("nudge-day-7", async () => {
      const { html, text } = nudgeDay7Email({ name });
      await sendEmail({
        to: email,
        subject: "One week in — where does your money go?",
        html,
        text,
      });
    });

    return { done: true };
  },
);
