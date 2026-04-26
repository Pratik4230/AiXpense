import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { inngest } from "@/inngest/client";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

function parseEmails(value: unknown) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((email) => (typeof email === "string" ? email.trim().toLowerCase() : ""))
        .filter(Boolean)
    )
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, body, emails } = await req.json();
    const cleanedEmails = parseEmails(emails);

    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    if (cleanedEmails.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient email is required" },
        { status: 400 }
      );
    }

    const invalidEmails = cleanedEmails.filter((email) => !EMAIL_REGEX.test(email));
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email addresses: ${invalidEmails.join(", ")}` },
        { status: 400 }
      );
    }

    await inngest.send({
      name: "admin/targeted-email",
      data: {
        subject: subject.trim(),
        body: body.trim(),
        emails: cleanedEmails,
        sentBy: session.user.email,
      },
    });

    return NextResponse.json({
      success: true,
      totalRecipients: cleanedEmails.length,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Failed to queue targeted email. Ensure Inngest dev server is running in local.",
      },
      { status: 500 }
    );
  }
}

