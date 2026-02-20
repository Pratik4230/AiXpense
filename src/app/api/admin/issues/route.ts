import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Issue } from "@/models";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const status = searchParams.get("status") ?? "all";
  const type = searchParams.get("type") ?? "all";

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status !== "all") filter.status = status;
  if (type !== "all") filter.type = type;

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
      userEmail: i.userEmail ?? "unknown",
      createdAt: (i.createdAt as Date).toISOString(),
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}
