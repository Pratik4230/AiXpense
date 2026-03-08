import { Resend } from "resend";
import { logger } from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "AiXpense <noreply@aixpense.in>";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    logger.error("email_fail", {
      error,
      data: { to, subject },
    });
    throw new Error("Failed to send email");
  }

  return data;
}

export * from "./templates";
