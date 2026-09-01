import { baseLayout, heading, mutedParagraph, paragraph } from "./base";

const TEXT = "#1a1a1a";
const MUTED = "#555555";
const BORDER = "#e5e5e5";
const SOFT_BG = "#fafafa";

function otpBlock(otp: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <div style="display: inline-block; background-color: ${SOFT_BG}; border: 1px solid ${BORDER}; border-radius: 8px; padding: 20px 32px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: ${TEXT}; font-family: 'Courier New', monospace;">${otp}</span>
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
    ${heading(titles[type])}
    ${paragraph(descriptions[type])}
    ${otpBlock(otp)}
    ${mutedParagraph("This code expires in 5 minutes.")}
    <div style="margin-top: 8px; padding: 14px 16px; background-color: ${SOFT_BG}; border: 1px solid ${BORDER}; border-radius: 8px;">
      <p style="margin: 0; font-size: 13px; color: ${MUTED}; line-height: 1.6;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  `);

  const text = `${titles[type]}\n\nYour verification code is: ${otp}\n\nThis code expires in 5 minutes. If you didn't request this, ignore this email.`;

  return { html, text };
}
