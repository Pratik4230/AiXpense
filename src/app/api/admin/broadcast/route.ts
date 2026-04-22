import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { inngest } from "@/inngest/client";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, body } = await req.json();

    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    await inngest.send({
      name: "admin/broadcast-email",
      data: {
        subject: subject.trim(),
        body: body.trim(),
        sentBy: session.user.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Failed to queue broadcast email. Ensure Inngest dev server is running in local.",
      },
      { status: 500 }
    );
  }
}
