import { betterAuth, APIError } from "better-auth";
import { expo } from "@better-auth/expo";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "@/lib/db";
import { sendEmail } from "@/lib/email/index";
import { resetPasswordEmail } from "@/lib/email/templates/resetPassword";
import { verifyEmailTemplate } from "@/lib/email/templates/verifyEmail";
import { connectDB } from "@/lib/db";
import {
  Expense,
  Budget,
  Conversation,
  Subscription,
  DeletedEmail,
} from "@/models";
import { isDisposableEmail } from "@/lib/auth/blockedDomains";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://aixpense.in",
    "https://www.aixpense.in",
    "http://localhost:8081",
    "exp://localhost:8081",
    "aixpensemobile://",
    "exp://**",
  ],
  plugins: [expo()],
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
        const u = user as { freeTrials?: number };
        await Promise.all([
          DeletedEmail.findOneAndUpdate(
            { email: user.email.toLowerCase() },
            { trialsRemaining: u.freeTrials ?? 0, deletedAt: new Date() },
            { upsert: true },
          ),
          Expense.deleteMany({ userId: user.id }),
          Budget.deleteMany({ userId: user.id }),
          Conversation.deleteMany({ userId: user.id }),
          Subscription.deleteMany({ userId: user.id }),
        ]);
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (isDisposableEmail(user.email)) {
            throw new APIError("BAD_REQUEST", {
              message:
                "This email domain is not allowed. Please use a valid email address.",
            });
          }

          await connectDB();
          const deleted = await DeletedEmail.findOne({
            email: user.email.toLowerCase(),
          });
          if (deleted) {
            return {
              data: {
                ...user,
                freeTrials: deleted.trialsRemaining,
              },
            };
          }
        },
      },
    },
  },
  rateLimit: {
    window: 60,
    max: 10,
    storage: "memory",
  },
});
