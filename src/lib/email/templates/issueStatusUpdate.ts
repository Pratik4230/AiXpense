import {
  actionButton,
  baseLayout,
  heading,
  infoBox,
  infoRow,
  infoRowLast,
  mutedParagraph,
} from "./base";

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const STATUS_COLOR: Record<string, string> = {
  open: "#dc2626",
  in_progress: "#b45309",
  resolved: "#16a34a",
  closed: "#555555",
};

export function issueStatusUpdateEmail({
  title,
  type,
  status,
  adminNote,
  appUrl,
}: {
  title: string;
  type: string;
  status: string;
  adminNote?: string;
  appUrl: string;
}) {
  const statusLabel = STATUS_LABELS[status] ?? status;
  const statusColor = STATUS_COLOR[status] ?? "#555555";

  const noteSection = adminNote
    ? `
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
        <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #1a1a1a;">Note from our team</p>
        <p style="margin: 0; font-size: 14px; color: #333333; white-space: pre-wrap; line-height: 1.6;">${adminNote}</p>
      </div>`
    : "";

  const content = `
    ${heading("Issue update")}
    ${mutedParagraph("Your reported issue has been updated.")}
    ${infoBox(`
      ${infoRow("Issue", title)}
      ${infoRow("Type", type)}
      ${infoRowLast(
        "Status",
        `<span style="display: inline-block; margin-left: 4px; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #ffffff; background: ${statusColor};">${statusLabel}</span>`
      )}
      ${noteSection}
    `)}
    ${actionButton("View My Reports", `${appUrl}/profile`)}
  `;

  return baseLayout(content);
}
