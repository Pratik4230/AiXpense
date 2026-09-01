import {
  baseLayout,
  footerNote,
  formatBodyLines,
  greeting,
  heading,
  link,
} from "./base";

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

  const content = `
    ${heading(subject)}
    ${greeting(firstName)}
    ${formatBodyLines(body)}
    ${footerNote(`This message was sent to all AiXpense users. ${link("https://aixpense.in/aixpense", "Open AiXpense")}`)}
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${firstName},\n\n${body}\n\nAiXpense Team\nhttps://aixpense.in`,
  };
}
