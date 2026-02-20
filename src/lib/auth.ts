import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "@/lib/db";
import { sendEmail } from "@/lib/email/index";
import { resetPasswordEmail } from "@/lib/email/templates/resetPassword";
import { verifyEmailTemplate } from "@/lib/email/templates/verifyEmail";
import { connectDB } from "@/lib/db";
import { Expense, Budget, Conversation, Subscription } from "@/models";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["https://aixpense.in", "https://www.aixpense.in"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { html, text } = resetPasswordEmail(user.name, url);
      void sendEmail({
        to: user.email,
        subject: "Reset your AiXpense password",
        html,
        text,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { html, text } = verifyEmailTemplate(user.name, url);
      void sendEmail({
        to: user.email,
        subject: "Verify your AiXpense email",
        html,
        text,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      isPremium: {
        type: "boolean",
        defaultValue: false,
      },
      freeTrials: {
        type: "number",
        defaultValue: 5,
      },
      onboardingCompleted: {
        type: "boolean",
        defaultValue: false,
      },
    },
    deleteUser: {
      enabled: true,
      afterDelete: async (user) => {
        await connectDB();
        await Promise.all([
          Expense.deleteMany({ userId: user.id }),
          Budget.deleteMany({ userId: user.id }),
          Conversation.deleteMany({ userId: user.id }),
          Subscription.deleteMany({ userId: user.id }),
        ]);
      },
    },
  },
  rateLimit: {
    window: 60,
    max: 10,
    storage: "memory",
  },
});
