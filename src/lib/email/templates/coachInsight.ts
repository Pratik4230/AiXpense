import { baseLayout, actionButton } from "./base";

export function coachInsightEmail({
  name,
  insight,
  period,
  totalSpent,
  currency = "INR",
}: {
  name: string;
  insight: string;
  period: string;
  totalSpent: number;
  currency?: string;
}) {
  const firstName = name?.split(" ")[0] || "there";
  const cleanInsight = insight.replace(/\s*--\s*/g, " ").replace(/\s*—\s*/g, " ").trim();
  const formattedAmount = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(totalSpent);

  const content = `
    <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #18181b;">Your ${period} Spending Summary</h2>
    <p style="margin: 0 0 20px; font-size: 15px; color: #52525b; line-height: 1.7;">Hey ${firstName}, your AI coach has analysed your spending.</p>

    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px 20px; margin: 0 0 20px;">
      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">Total Spent</p>
      <p style="margin: 0; font-size: 28px; font-weight: 700; color: #b45309;">${formattedAmount}</p>
    </div>

    <div style="background: #f4f4f5; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px;">
      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">AI Coach Insight</p>
      <p style="margin: 0; font-size: 15px; color: #27272a; line-height: 1.7;">${cleanInsight}</p>
    </div>

    ${actionButton("View Full Report", "https://aixpense.in/reports")}
  `;

  return {
    html: baseLayout(content),
    text: `Your ${period} Summary, ${firstName}\n\nTotal Spent: ${formattedAmount}\n\nAI Coach: ${cleanInsight}\n\nView report: https://aixpense.in/reports`,
  };
}
