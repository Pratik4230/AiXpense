import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Issue } from "@/models";
import { sendEmail, newIssueEmailTemplate } from "@/lib/email";
import { z } from "zod";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

const createIssueSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  type: z.enum(["bug", "feature", "other"]),
  mediaUrls: z.array(z.url()).max(5).default([]),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createIssueSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectDB();

  const issue = await Issue.create({
    userId: session.user.id,
    userEmail: session.user.email,
    ...parsed.data,
  });

  sendEmail({
    to: ADMIN_EMAIL,
    subject: `[AiXpense] New ${parsed.data.type === "bug" ? "Bug Report" : parsed.data.type === "feature" ? "Feature Request" : "Issue"}: ${parsed.data.title}`,
    html: newIssueEmailTemplate({
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      mediaUrls: parsed.data.mediaUrls,
      userEmail: session.user.email,
      issueId: String(issue._id),
    }),
  }).catch((err) => console.error("Failed to send issue notification:", err));

  return Response.json({ success: true, issueId: issue._id }, { status: 201 });
}
