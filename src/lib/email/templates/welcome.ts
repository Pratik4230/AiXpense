import {
  baseLayout,
  actionButton,
  bulletList,
  greeting,
  heading,
  paragraph,
} from "./base";

export function welcomeEmail({ name }: { name: string }) {
  const firstName = name?.split(" ")[0] || "there";

  const content = `
    ${heading(`Welcome to AiXpense, ${firstName}`)}
    ${paragraph("Your AI expense tracker is ready. Just chat naturally — no forms, no categories to pick.")}
    ${bulletList([
      'Say <em>"lunch 250 today"</em> to log instantly',
      'Ask <em>"how much did I spend this week?"</em>',
      "Set budgets and get AI insights on your spending",
    ])}
    ${actionButton("Add Your First Expense", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Welcome to AiXpense, ${firstName}!\n\nYour AI expense tracker is ready. Just chat naturally: no forms needed.\n\nGet started: https://aixpense.in/aixpense`,
  };
}
