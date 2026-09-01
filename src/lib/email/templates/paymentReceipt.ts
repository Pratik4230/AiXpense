import {
  baseLayout,
  heading,
  infoBox,
  infoRow,
  infoRowLast,
  link,
  mutedParagraph,
  paragraph,
  statBlock,
} from "./base";

interface PaymentReceiptOptions {
  userName: string;
  plan: "monthly" | "yearly";
  amount: number;
  paymentDate: Date;
  nextBillingDate: Date;
  subscriptionId: string;
  isFirstPayment: boolean;
  /** ISO 4217; Razorpay charges are INR */
  currency?: string;
}

const PLAN_LABEL: Record<string, string> = {
  monthly: "Monthly Plan",
  yearly: "Yearly Plan",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function paymentReceiptTemplate({
  userName,
  plan,
  amount,
  paymentDate,
  nextBillingDate,
  subscriptionId,
  isFirstPayment,
  currency = "INR",
}: PaymentReceiptOptions): { subject: string; html: string } {
  const formatted = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  const subject = isFirstPayment
    ? "Welcome to AiXpense Premium: payment confirmed"
    : `AiXpense Premium renewed: ${formatted}`;

  const content = `
    ${heading(isFirstPayment ? "Payment confirmed" : "Subscription renewed")}
    ${paragraph(`Hi ${userName},`)}
    ${paragraph(
      isFirstPayment
        ? "Your AiXpense Premium subscription is now active. Here is your payment receipt."
        : "Your AiXpense Premium subscription has been renewed successfully. Here is your receipt."
    )}
    ${statBlock("Amount paid", formatted)}
    ${mutedParagraph(PLAN_LABEL[plan])}
    ${infoBox(`
      ${infoRow("Payment date", formatDate(paymentDate))}
      ${infoRow("Next billing date", formatDate(nextBillingDate))}
      ${infoRowLast("Subscription ID", subscriptionId)}
    `)}
  `;

  const html = baseLayout(
    `${content}
    <p style="margin: 0; font-size: 13px; color: #555555; line-height: 1.6;">
      Manage your subscription in ${link("https://aixpense.in/profile", "account settings")}.
      Questions? Email ${link("mailto:support@aixpense.in", "support@aixpense.in")}.
    </p>`
  );

  return { subject, html };
}
