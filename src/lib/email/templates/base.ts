const BRAND_COLOR = "#b45309";
const BRAND_GRADIENT =
  "linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)";

export function baseLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
              <tr>
                <td style="background: ${BRAND_GRADIENT}; padding: 32px 24px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">AiXpense</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 24px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="padding: 0 24px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border-top: 1px solid #e4e4e7; padding-top: 20px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #a1a1aa; line-height: 1.6;">
                          &copy; ${new Date().getFullYear()} AiXpense. All rights reserved.<br />
                          AI-powered expense tracking
                        </p>
                      </td>
                    </tr>
                  </table>
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

export function actionButton(text: string, url: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display: inline-block; background: ${BRAND_GRADIENT}; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 10px; text-decoration: none; letter-spacing: 0.3px;">${text}</a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-align: center; line-height: 1.6;">
      If the button doesn't work, copy and paste this link:<br />
      <a href="${url}" style="color: ${BRAND_COLOR}; word-break: break-all;">${url}</a>
    </p>
  `;
}
