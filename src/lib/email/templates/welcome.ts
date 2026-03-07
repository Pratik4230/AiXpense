import { baseLayout, actionButton } from "./base";

export function welcomeEmail({ name }: { name: string }) {
  const firstName = name?.split(" ")[0] || "there";

  const content = `
    <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #18181b;">Welcome to AiXpense, ${firstName}!</h2>
    <p style="margin: 0 0 20px; font-size: 15px; color: #52525b; line-height: 1.7;">
      Your AI-powered expense tracker is ready. Just chat naturally — no forms, no categories to pick.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
      <tr>
        <td style="padding: 6px 0; font-size: 14px; color: #3f3f46;">
          <span style="color: #b45309; font-weight: 600;">✦</span>&nbsp; Say <em>"lunch 250 today"</em> to log instantly
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 14px; color: #3f3f46;">
          <span style="color: #b45309; font-weight: 600;">✦</span>&nbsp; Ask <em>"how much did I spend this week?"</em>
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 14px; color: #3f3f46;">
          <span style="color: #b45309; font-weight: 600;">✦</span>&nbsp; Set budgets and get AI insights on your spending
        </td>
      </tr>
    </table>
    ${actionButton("Add Your First Expense", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Welcome to AiXpense, ${firstName}!\n\nYour AI expense tracker is ready. Just chat naturally — no forms needed.\n\nGet started: https://aixpense.in/aixpense`,
  };
}
