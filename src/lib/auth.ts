import { betterAuth, APIError } from "better-auth";
import { expo } from "@better-auth/expo";
import { emailOTP } from "better-auth/plugins";
import {
  dodopayments,
  checkout,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "@/lib/db";
import { sendEmail } from "@/lib/email/index";
import { otpEmail } from "@/lib/email/templates/otp";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import {
  Expense,
  Budget,
  Conversation,
  Subscription,
  DeletedEmail,
  Insight,
} from "@/models";
import { isDisposableEmail } from "@/lib/auth/blockedDomains";
import { inngest } from "@/inngest/client";
import {
  dodoWebhookSecretConfigured,
  isDodoPaymentsConfigured,
} from "@/lib/dodo/config";
import { getDodoPaymentsClient } from "@/lib/dodo/client";
import {
  onDodoSubscriptionActiveLike,
  onDodoSubscriptionCancelled,
  onDodoSubscriptionExpiredOrFailed,
  onDodoSubscriptionOnHold,
  onDodoSubscriptionRenewedLike,
  onDodoSubscriptionUpdatedLike,
} from "@/lib/dodo/webhookHandlers";
import { DEFAULT_COUNTRY, DEFAULT_CURRENCY } from "@/constants/currency";

const dodoPaymentsPlugin =
  isDodoPaymentsConfigured() && dodoWebhookSecretConfigured()
    ? dodopayments({
        client: getDodoPaymentsClient(),
        createCustomerOnSignUp: true,
        getCustomerParams: (user) => ({
          // Per Dodo metadata guide + Better Auth adaptor: stable ids on the customer for webhooks.
          metadata: { userId: user.id, referenceId: user.id },
        }),
        use: [
          checkout({
            products: [
              {
                productId: process.env.DODO_PRODUCT_ID_PREMIUM_MONTHLY!,
                slug: "premium-monthly-intl",
              },
              {
                productId: process.env.DODO_PRODUCT_ID_PREMIUM_YEARLY!,
                slug: "premium-yearly-intl",
              },
            ],
            successUrl: "/premium/success",
            authenticatedUsersOnly: true,
          }),
          portal(),
          webhooks({
            webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
            onSubscriptionActive: onDodoSubscriptionActiveLike,
            onSubscriptionRenewed: onDodoSubscriptionRenewedLike,
            onSubscriptionPlanChanged: onDodoSubscriptionUpdatedLike,
            onSubscriptionUpdated: onDodoSubscriptionUpdatedLike,
            onSubscriptionCancelled: onDodoSubscriptionCancelled,
            onSubscriptionExpired: onDodoSubscriptionExpiredOrFailed,
            onSubscriptionFailed: onDodoSubscriptionExpiredOrFailed,
            onSubscriptionOnHold: onDodoSubscriptionOnHold,
          }),
        ],
      })
    : null;

function buildTrustedOrigins(): string[] {
  const origins: string[] = [];
  const add = (value?: string | null) => {
    const o = value?.trim().replace(/\/$/, "");
    if (o && !origins.includes(o)) origins.push(o);
  };
  add(process.env.NEXT_PUBLIC_APP_URL);
  add(process.env.BETTER_AUTH_URL);
  for (const part of process.env.ADDITIONAL_TRUSTED_ORIGINS?.split(",") ?? []) {
    add(part);
  }
  if (process.env.NODE_ENV !== "production") {
    add("http://localhost:3000");
    add("http://127.0.0.1:3000");
  }
  origins.push(
    "https://aixpense.in",
    "https://www.aixpense.in",
    // Some native/expo clients send no Origin header; Better Auth may fall back to Host.
    "aixpense.in",
    "www.aixpense.in",
    "http://localhost:8081",
    "exp://localhost:8081",
    "aixpensemobile://",
    // Expo deep-link schemes (must match `app.config.js` per APP_VARIANT).
    "aixpense://",
    "aixpense://*",
    "aixpense-dev://",
    "aixpense-dev://*",
    "aixpense-preview://",
    "aixpense-preview://*",
    "exp://**",
    "exp://*",
  );
  return origins;
}

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: buildTrustedOrigins(),
  plugins: [
    expo(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {

        const { html, text } = otpEmail(otp, type);
        const subjects: Record<string, string> = {
          "email-verification": "Verify your AiXpense email",
          "sign-in": "Sign in to AiXpense",
          "forget-password": "Reset your AiXpense password",
        };
        try {
          await sendEmail({
            to: email,
            subject: subjects[type],
            html,
            text,
          });
        } catch (err) {
          console.error(`[OTP] Failed to send ${type} email to ${email}:`, err);
        }
      },
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 300,
    }),
    ...(dodoPaymentsPlugin ? [dodoPaymentsPlugin] : []),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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
        defaultValue: 7,
      },
      freeTrialResetAt: {
        type: "date",
        defaultValue: () => new Date(),
      },
      currency: {
        type: "string",
        defaultValue: DEFAULT_CURRENCY,
      },
      country: {
        type: "string",
        defaultValue: DEFAULT_COUNTRY,
      },
    },
    deleteUser: {
      enabled: true,
      afterDelete: async (user) => {
        await connectDB();
        const u = user as { freeTrials?: number };
        const userObjectId = new mongoose.Types.ObjectId(user.id);
        await Promise.all([
          DeletedEmail.findOneAndUpdate(
            { email: user.email.toLowerCase() },
            { trialsRemaining: u.freeTrials ?? 0, deletedAt: new Date() },
            { upsert: true },
          ),
          Expense.deleteMany({ userId: userObjectId }),
          Budget.deleteMany({ userId: userObjectId }),
          Conversation.deleteMany({ userId: userObjectId }),
          Subscription.deleteMany({ userId: user.id }),
          Insight.deleteMany({ userId: userObjectId }),
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
        after: async (user) => {
          try {
            await inngest.send({
              name: "user/created",
              data: {
                userId: user.id,
                email: user.email,
                name: user.name,
              },
            });
          } catch (error) {
            console.error(
              "[Inngest] Failed to send user/created event:",
              error,
            );
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
