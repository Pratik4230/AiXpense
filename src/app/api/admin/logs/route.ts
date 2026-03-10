import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { AppLog } from "@/models";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const PAGE_SIZE = 50;

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const level = searchParams.get("level") ?? "all";
  const event = searchParams.get("event") ?? "all";
  const userId = searchParams.get("userId") ?? "";

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (level !== "all") filter.level = level;
  if (event !== "all") filter.event = event;
  if (userId) filter.userId = userId;

  const [total, logs] = await Promise.all([
    AppLog.countDocuments(filter),
    AppLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
  ]);

  return Response.json({
    logs: logs.map((l) => ({
      id: String(l._id),
      level: l.level,
      event: l.event,
      userId: l.userId ?? null,
      data: l.data ?? null,
      error: l.error ?? null,
      createdAt: (l.createdAt as Date).toISOString(),
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}
