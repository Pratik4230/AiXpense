import { baseLayout, actionButton } from "./base";

export function verifyEmailTemplate(name: string, url: string) {
  const html = baseLayout(`
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #18181b;">Verify your email</h2>
    <p style="margin: 0 0 20px; font-size: 14px; color: #71717a; line-height: 1.7;">
      Hi <strong style="color: #18181b;">${name}</strong>,
    </p>
    <p style="margin: 0 0 4px; font-size: 14px; color: #71717a; line-height: 1.7;">
      Welcome to AiXpense! Please verify your email address to activate your account and start tracking your expenses with AI.
    </p>
    ${actionButton("Verify Email", url)}
    <div style="margin-top: 24px; padding: 16px; background-color: #fafafa; border-radius: 8px; border-left: 3px solid #e4e4e7;">
      <p style="margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.6;">
        If you didn't create an account on AiXpense, you can safely ignore this email.
      </p>
    </div>
  `);

  const text = `Hi ${name},\n\nWelcome to AiXpense! Please verify your email address by clicking the link below:\n\n${url}\n\nIf you didn't create an account, you can safely ignore this email.`;

  return { html, text };
}
