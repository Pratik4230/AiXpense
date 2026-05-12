import { baseLayout } from "./base";

export function broadcastEmail({
  name,
  subject,
  body,
}: {
  name: string;
  subject: string;
  body: string;
}) {
  const firstName = name?.split(" ")[0] || "there";

  const formattedBody = body
    .split("\n")
    .map((line) =>
      line.trim()
        ? `<p style="margin: 0 0 14px; font-size: 15px; color: #52525b; line-height: 1.7;">${line}</p>`
        : `<p style="margin: 0 0 14px;"></p>`
    )
    .join("");

  const content = `
    <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #18181b;">${subject}</h2>
    <p style="margin: 0 0 20px; font-size: 14px; color: #a1a1aa;">Hey ${firstName},</p>
    ${formattedBody}
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e4e4e7;">
      <p style="margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.6;">
        This message was sent to all AiXpense users. 
        <a href="https://aixpense.in/aixpense" style="color: #b45309;">Open AiXpense</a>
      </p>
    </div>
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${firstName},\n\n${body}\n\nAiXpense Team\nhttps://aixpense.in`,
  };
}
