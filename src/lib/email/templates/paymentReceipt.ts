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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#18181b;border-radius:12px;border:1px solid #27272a;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:32px 40px;border-bottom:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">AiXpense</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#71717a;">Payment Receipt</p>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.5px;">PREMIUM</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;font-size:15px;color:#a1a1aa;">Hi ${userName},</p>
              <p style="margin:0 0 28px;font-size:15px;color:#d4d4d8;line-height:1.6;">
                ${
                  isFirstPayment
                    ? "Your AiXpense Premium subscription is now active. Here's your payment receipt."
                    : "Your AiXpense Premium subscription has been renewed successfully. Here's your receipt."
                }
              </p>

              <!-- Amount box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;border-radius:8px;border:1px solid #27272a;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:13px;color:#71717a;text-transform:uppercase;letter-spacing:0.8px;">Amount Paid</p>
                    <p style="margin:0;font-size:40px;font-weight:700;color:#ffffff;">${formatted}</p>
                    <p style="margin:6px 0 0;font-size:13px;color:#a1a1aa;">${PLAN_LABEL[plan]}</p>
                  </td>
                </tr>
              </table>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#71717a;">Payment Date</td>
                        <td align="right" style="font-size:13px;color:#d4d4d8;font-weight:500;">${formatDate(paymentDate)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#71717a;">Next Billing Date</td>
                        <td align="right" style="font-size:13px;color:#d4d4d8;font-weight:500;">${formatDate(nextBillingDate)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#71717a;">Subscription ID</td>
                        <td align="right" style="font-size:12px;color:#71717a;font-family:monospace;">${subscriptionId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #27272a;">
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                You can manage your subscription anytime from your
                <a href="https://aixpense.in/profile" style="color:#a1a1aa;text-decoration:underline;">account settings</a>.
                For any queries, reach us at
                <a href="mailto:support@aixpense.in" style="color:#a1a1aa;text-decoration:underline;">support@aixpense.in</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
