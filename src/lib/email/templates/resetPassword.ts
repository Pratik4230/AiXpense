import { baseLayout, actionButton } from "./base";

export function resetPasswordEmail(name: string, url: string) {
  const html = baseLayout(`
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #18181b;">Reset your password</h2>
    <p style="margin: 0 0 20px; font-size: 14px; color: #71717a; line-height: 1.7;">
      Hi <strong style="color: #18181b;">${name}</strong>,
    </p>
    <p style="margin: 0 0 4px; font-size: 14px; color: #71717a; line-height: 1.7;">
      We received a request to reset your password. Click the button below to set a new one.
    </p>
    ${actionButton("Reset Password", url)}
    <div style="margin-top: 24px; padding: 16px; background-color: #fafafa; border-radius: 8px; border-left: 3px solid #e4e4e7;">
      <p style="margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.6;">
        This link will expire shortly. If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
  `);

  const text = `Hi ${name},\n\nWe received a request to reset your password. Use the link below to set a new password:\n\n${url}\n\nThis link will expire shortly. If you didn't request this, you can safely ignore this email.`;

  return { html, text };
}
