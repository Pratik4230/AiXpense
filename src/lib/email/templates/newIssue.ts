import { baseLayout } from "./base";

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
      <tr>
        <td style="padding-top: 16px;">
          <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #3f3f46;">Attachments (${mediaUrls.length})</p>
          ${mediaUrls
            .map(
              (url) =>
                `<p style="margin: 2px 0; font-size: 12px;"><a href="${url}" style="color: #b45309; word-break: break-all;">${url}</a></p>`,
            )
            .join("")}
        </td>
      </tr>`
      : "";

  const content = `
    <h2 style="margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #18181b;">New Issue Reported</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #71717a;">A user has submitted a new issue on AiXpense.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
      <tr>
        <td>
          <p style="margin: 0 0 12px; font-size: 13px; color: #71717a;">
            <strong style="color: #3f3f46;">Issue ID:</strong> ${issueId}
          </p>
          <p style="margin: 0 0 12px; font-size: 13px; color: #71717a;">
            <strong style="color: #3f3f46;">Type:</strong> ${typeLabel}
          </p>
          <p style="margin: 0 0 12px; font-size: 13px; color: #71717a;">
            <strong style="color: #3f3f46;">From:</strong> ${userEmail}
          </p>
          <p style="margin: 0; font-size: 13px; color: #71717a;">
            <strong style="color: #3f3f46;">Title:</strong> ${title}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 16px;">
          <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #3f3f46;">Description</p>
          <p style="margin: 0; font-size: 13px; color: #52525b; white-space: pre-wrap; line-height: 1.6;">${description}</p>
        </td>
      </tr>
      ${mediaSection}
    </table>
  `;

  return baseLayout(content);
}
