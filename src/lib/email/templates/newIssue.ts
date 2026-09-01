import {
  baseLayout,
  heading,
  infoBox,
  infoRow,
  infoRowLast,
  link,
  mutedParagraph,
} from "./base";

const TYPE_LABELS: Record<string, string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  other: "Other",
};

export function newIssueEmailTemplate({
  title,
  description,
  type,
  mediaUrls,
  userEmail,
  issueId,
}: {
  title: string;
  description: string;
  type: string;
  mediaUrls: string[];
  userEmail: string;
  issueId: string;
}) {
  const typeLabel = TYPE_LABELS[type] ?? type;

  const mediaSection =
    mediaUrls.length > 0
      ? `
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
        <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #1a1a1a;">Attachments (${mediaUrls.length})</p>
        ${mediaUrls
          .map(
            (url) =>
              `<p style="margin: 4px 0; font-size: 13px;">${link(url, url)}</p>`,
          )
          .join("")}
      </div>`
      : "";

  const content = `
    ${heading("New issue reported")}
    ${mutedParagraph("A user has submitted a new issue on AiXpense.")}
    ${infoBox(`
      ${infoRow("Issue ID", issueId)}
      ${infoRow("Type", typeLabel)}
      ${infoRow("From", userEmail)}
      ${infoRowLast("Title", title)}
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
        <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #1a1a1a;">Description</p>
        <p style="margin: 0; font-size: 14px; color: #333333; white-space: pre-wrap; line-height: 1.6;">${description}</p>
      </div>
      ${mediaSection}
    `)}
  `;

  return baseLayout(content);
}
