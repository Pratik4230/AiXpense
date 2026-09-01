import { actionButton, baseLayout, callout, greeting, heading, paragraph, statBlock } from "./base";
import { DEFAULT_CURRENCY } from "@/constants/currency";

export function coachInsightEmail({
  name,
  insight,
  period,
  totalSpent,
  currency = DEFAULT_CURRENCY,
}: {
  name: string;
  insight: string;
  period: string;
  totalSpent: number;
  currency?: string;
}) {
  const cleanInsight = insight
    .replace(/\s*--\s*/g, " ")
    .replace(/\s*—\s*/g, " ")
    .trim();
  const formattedAmount = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(totalSpent);

  const content = `
    ${heading(`Your ${period} spending summary`)}
    ${greeting(name)}
    ${paragraph("Your AI coach has analysed your spending.")}
    ${statBlock("Total spent", formattedAmount)}
    ${callout(`<strong>AI coach insight</strong><br /><br />${cleanInsight}`)}
    ${actionButton("View Full Report", "https://aixpense.in/reports")}
  `;

  return {
    html: baseLayout(content),
    text: `Your ${period} Summary\n\nTotal Spent: ${formattedAmount}\n\nAI Coach: ${cleanInsight}\n\nView report: https://aixpense.in/reports`,
  };
}
