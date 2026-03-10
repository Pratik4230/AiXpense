import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Issue } from "@/models";
import { sendEmail, newIssueEmailTemplate } from "@/lib/email";
import { z } from "zod";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const PAGE_SIZE = 10;

const createIssueSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  type: z.enum(["bug", "feature", "other"]),
  mediaUrls: z.array(z.url()).max(5).default([]),
  mediaFileIds: z.array(z.string()).max(5).default([]),
});

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  await connectDB();

  const filter = { userId: session.user.id };
  const [total, issues] = await Promise.all([
    Issue.countDocuments(filter),
    Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
  ]);

  return Response.json({
    issues: issues.map((i) => ({
      id: String(i._id),
      title: i.title,
      description: i.description,
      type: i.type,
      status: i.status,
      mediaUrls: i.mediaUrls ?? [],
      adminNote: i.adminNote ?? "",
      createdAt: (i.createdAt as Date).toISOString(),
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}

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
