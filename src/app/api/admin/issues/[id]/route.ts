import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Issue } from "@/models";
import { z } from "zod";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = z
    .object({ status: z.enum(["open", "in_progress", "resolved", "closed"]) })
    .safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  await connectDB();
  await Issue.findByIdAndUpdate(id, { status: parsed.data.status });

  return Response.json({ success: true });
}
