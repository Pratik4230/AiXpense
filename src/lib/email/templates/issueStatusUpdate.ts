import { baseLayout, actionButton } from "./base";

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const STATUS_COLOR: Record<string, string> = {
  open: "#ef4444",
  in_progress: "#f59e0b",
  resolved: "#22c55e",
  closed: "#71717a",
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
  const statusColor = STATUS_COLOR[status] ?? "#71717a";

  const noteSection = adminNote
    ? `
      <tr>
        <td style="padding-top: 16px;">
          <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #3f3f46;">Note from our team</p>
          <p style="margin: 0; font-size: 13px; color: #52525b; white-space: pre-wrap; line-height: 1.6; background: #f4f4f5; border-radius: 8px; padding: 12px;">${adminNote}</p>
        </td>
      </tr>`
    : "";

  const content = `
    <h2 style="margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #18181b;">Issue Update</h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #71717a;">Your reported issue has been updated.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
      <tr>
        <td>
          <p style="margin: 0 0 12px; font-size: 13px; color: #71717a;">
            <strong style="color: #3f3f46;">Issue:</strong> ${title}
          </p>
          <p style="margin: 0 0 12px; font-size: 13px; color: #71717a;">
            <strong style="color: #3f3f46;">Type:</strong> ${type}
          </p>
          <p style="margin: 0; font-size: 13px; color: #71717a;">
            <strong style="color: #3f3f46;">Status:</strong>
            <span style="display: inline-block; margin-left: 4px; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #fff; background: ${statusColor};">${statusLabel}</span>
          </p>
        </td>
      </tr>
      ${noteSection}
    </table>

    ${actionButton("View My Reports", `${appUrl}/profile`)}
  `;

  return baseLayout(content);
}
