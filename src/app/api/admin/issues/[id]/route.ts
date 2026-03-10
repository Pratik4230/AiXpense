import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Issue } from "@/models";
import { z } from "zod";
import { deleteImageKitFiles } from "@/lib/imagekit";
import { sendEmail, issueStatusUpdateEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aixpense.in";

const NOTIFIABLE_STATUSES = new Set(["in_progress", "resolved", "closed"]);

const TYPE_LABELS: Record<string, string> = {
  bug: "Bug Report",
  feature: "Feature Request",
  other: "Other",
};

const patchSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  adminNote: z.string().max(2000).optional(),
});

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.email !== ADMIN_EMAIL) return null;
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();

  const before = await Issue.findById(id).lean();
  if (!before) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await Issue.findByIdAndUpdate(
    id,
    { $set: parsed.data },
    { new: true },
  ).lean();

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const statusChanged =
    parsed.data.status && parsed.data.status !== before.status;
  const noteChanged =
    parsed.data.adminNote !== undefined &&
    parsed.data.adminNote !== before.adminNote;

  const newStatus = updated.status;
  const shouldCleanMedia =
    statusChanged && newStatus === "closed" && before.mediaFileIds?.length;

  if (shouldCleanMedia) {
    deleteImageKitFiles(before.mediaFileIds as string[]).catch((err) =>
      logger.error("imagekit_delete_failed", { error: err, data: { id } }),
    );
  }

  const shouldNotify =
    (statusChanged && NOTIFIABLE_STATUSES.has(newStatus)) ||
    (noteChanged && !!parsed.data.adminNote);

  if (shouldNotify) {
    sendEmail({
      to: before.userEmail as string,
      subject: `[AiXpense] Your ${TYPE_LABELS[before.type as string] ?? "issue"} has been updated`,
      html: issueStatusUpdateEmail({
        title: before.title as string,
        type: TYPE_LABELS[before.type as string] ?? (before.type as string),
        status: newStatus,
        adminNote: updated.adminNote || undefined,
        appUrl: APP_URL,
      }),
    }).catch((err) =>
      logger.error("issue_notify_email_failed", { error: err, data: { id } }),
    );
  }

  return Response.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const issue = await Issue.findByIdAndDelete(id).lean();

  if (!issue) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (issue.mediaFileIds?.length) {
    deleteImageKitFiles(issue.mediaFileIds as string[]).catch((err) =>
      logger.error("imagekit_delete_failed", { error: err, data: { id } }),
    );
  }

  return Response.json({ success: true });
}
