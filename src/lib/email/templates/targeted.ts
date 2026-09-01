import {
  baseLayout,
  footerNote,
  formatBodyLines,
  heading,
  link,
} from "./base";

export function targetedEmail({
  subject,
  body,
}: {
  subject: string;
  body: string;
}) {
  const content = `
    ${heading(subject)}
    ${formatBodyLines(body)}
    ${footerNote(link("https://aixpense.in/aixpense", "Open AiXpense"))}
  `;

  return {
    html: baseLayout(content),
    text: `${body}\n\nAiXpense Team\nhttps://aixpense.in`,
  };
}
