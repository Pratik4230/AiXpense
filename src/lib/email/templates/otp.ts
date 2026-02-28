import { baseLayout } from "./base";

const BRAND_COLOR = "#b45309";

function otpBlock(otp: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <div style="display: inline-block; background-color: #fafafa; border: 2px dashed #e4e4e7; border-radius: 12px; padding: 20px 40px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: ${BRAND_COLOR}; font-family: 'Courier New', monospace;">${otp}</span>
          </div>
        </td>
      </tr>
    </table>
  `;
}

export function otpEmail(
  otp: string,
  type: "email-verification" | "sign-in" | "forget-password",
) {
  const titles: Record<string, string> = {
    "email-verification": "Verify your email",
    "sign-in": "Sign in to AiXpense",
    "forget-password": "Reset your password",
  };

  const descriptions: Record<string, string> = {
    "email-verification":
      "Use the code below to verify your email address and activate your account.",
    "sign-in": "Use the code below to sign in to your AiXpense account.",
    "forget-password": "Use the code below to reset your password.",
  };

  const html = baseLayout(`
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #18181b;">${titles[type]}</h2>
    <p style="margin: 0 0 4px; font-size: 14px; color: #71717a; line-height: 1.7;">
      ${descriptions[type]}
    </p>
    ${otpBlock(otp)}
    <p style="margin: 0 0 4px; font-size: 13px; color: #71717a; line-height: 1.7; text-align: center;">
      This code expires in 5 minutes.
    </p>
    <div style="margin-top: 24px; padding: 16px; background-color: #fafafa; border-radius: 8px; border-left: 3px solid #e4e4e7;">
      <p style="margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.6;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  `);

  const text = `${titles[type]}\n\nYour verification code is: ${otp}\n\nThis code expires in 5 minutes. If you didn't request this, ignore this email.`;

  return { html, text };
}
