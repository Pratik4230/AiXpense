import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await auth.api.listSessions({ headers: hdrs });
  const currentSessionId = session.session.id;

  const sessions = result.map((s) => ({
    id: s.id,
    token: s.token,
    ipAddress: s.ipAddress ?? null,
    userAgent: s.userAgent ?? null,
    createdAt: s.createdAt.toISOString(),
    isCurrent: s.id === currentSessionId,
  }));

  return NextResponse.json({ sessions, currentSessionId });
}
