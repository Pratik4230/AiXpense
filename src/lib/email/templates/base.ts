const BRAND = "#b45309";
const TEXT = "#1a1a1a";
const BODY = "#333333";
const MUTED = "#555555";
const LIGHT = "#777777";
const BORDER = "#e5e5e5";
const PAGE_BG = "#f5f5f5";
const CARD_BG = "#ffffff";
const SOFT_BG = "#fafafa";

export function baseLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background-color: ${PAGE_BG}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${PAGE_BG}; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="padding: 24px 28px 16px; border-bottom: 1px solid ${BORDER};">
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${TEXT}; letter-spacing: -0.3px;">AiXpense</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 28px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="padding: 0 28px 24px;">
                  <p style="margin: 0; padding-top: 20px; border-top: 1px solid ${BORDER}; font-size: 12px; color: ${LIGHT}; line-height: 1.6; text-align: center;">
                    &copy; ${new Date().getFullYear()} AiXpense
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function heading(text: string) {
  return `<h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 600; color: ${TEXT}; line-height: 1.35;">${text}</h1>`;
}

export function greeting(name: string) {
  const firstName = name?.split(" ")[0] || "there";
  return `<p style="margin: 0 0 20px; font-size: 15px; color: ${MUTED}; line-height: 1.6;">Hi ${firstName},</p>`;
}

export function paragraph(text: string) {
  return `<p style="margin: 0 0 16px; font-size: 15px; color: ${BODY}; line-height: 1.65;">${text}</p>`;
}

export function mutedParagraph(text: string) {
  return `<p style="margin: 0 0 16px; font-size: 14px; color: ${MUTED}; line-height: 1.6;">${text}</p>`;
}

export function formatBodyLines(body: string) {
  return body
    .split("\n")
    .map((line) =>
      line.trim() ? paragraph(line) : `<p style="margin: 0 0 12px;"></p>`
    )
    .join("");
}

export function callout(content: string) {
  return `
    <div style="background: ${SOFT_BG}; border: 1px solid ${BORDER}; border-radius: 8px; padding: 16px; margin: 0 0 20px;">
      <p style="margin: 0; font-size: 15px; color: ${BODY}; line-height: 1.65;">${content}</p>
    </div>
  `;
}

export function bulletList(items: string[]) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 4px 0; font-size: 15px; color: ${BODY}; line-height: 1.6;">
            &bull;&nbsp; ${item}
          </td>
        </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 20px;">
      ${rows}
    </table>
  `;
}

export function infoBox(rows: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${SOFT_BG}; border: 1px solid ${BORDER}; border-radius: 8px; margin: 0 0 20px;">
      <tr>
        <td style="padding: 16px;">
          ${rows}
        </td>
      </tr>
    </table>
  `;
}

export function infoRow(label: string, value: string) {
  return `
    <p style="margin: 0 0 10px; font-size: 14px; color: ${BODY}; line-height: 1.5;">
      <strong style="color: ${TEXT};">${label}:</strong> ${value}
    </p>
  `;
}

export function infoRowLast(label: string, value: string) {
  return `
    <p style="margin: 0; font-size: 14px; color: ${BODY}; line-height: 1.5;">
      <strong style="color: ${TEXT};">${label}:</strong> ${value}
    </p>
  `;
}

export function statBlock(label: string, value: string) {
  return `
    <div style="background: ${SOFT_BG}; border: 1px solid ${BORDER}; border-radius: 8px; padding: 16px 20px; margin: 0 0 16px;">
      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: ${MUTED}; text-transform: uppercase; letter-spacing: 0.4px;">${label}</p>
      <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${TEXT};">${value}</p>
    </div>
  `;
}

export function footerNote(html: string) {
  return `
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid ${BORDER};">
      <p style="margin: 0; font-size: 13px; color: ${MUTED}; line-height: 1.6;">${html}</p>
    </div>
  `;
}

export function actionButton(text: string, url: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0 16px;">
      <tr>
        <td>
          <a href="${url}" style="display: inline-block; background-color: ${BRAND}; color: #ffffff; font-size: 15px; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none;">${text}</a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 12px; color: ${LIGHT}; line-height: 1.6;">
      Or open this link: <a href="${url}" style="color: ${BRAND}; word-break: break-all;">${url}</a>
    </p>
  `;
}

export function link(url: string, label = url) {
  return `<a href="${url}" style="color: ${BRAND}; text-decoration: underline;">${label}</a>`;
}
