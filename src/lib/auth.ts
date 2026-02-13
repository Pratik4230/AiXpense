import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your AiXpense password",
        text: `Hi ${user.name},\n\nWe received a request to reset your password. Use the link below to set a new password:\n\n${url}\n\nThis link will expire shortly. If you didn't request this, you can safely ignore this email.`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1a1a;">Reset your password</h2>
            <p style="color: #4a4a4a;">Hi ${user.name},</p>
            <p style="color: #4a4a4a;">We received a request to reset your password. Click the button below to set a new password:</p>
            <a href="${url}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Reset Password</a>
            <p style="color: #888; font-size: 14px;">This link will expire shortly. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your AiXpense email",
        text: `Hi ${user.name},\n\nPlease verify your email address by clicking the link below:\n\n${url}\n\nIf you didn't create an account, you can safely ignore this email.`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a1a1a;">Verify your email</h2>
            <p style="color: #4a4a4a;">Hi ${user.name},</p>
            <p style="color: #4a4a4a;">Please verify your email address by clicking the button below:</p>
            <a href="${url}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Verify Email</a>
            <p style="color: #888; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `,
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
    },
  },
});
