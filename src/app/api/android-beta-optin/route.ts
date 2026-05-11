import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { connectDB } from "@/lib/db";
import { AndroidBetaSignup } from "@/models";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const androidBetaOptInSchema = z.object({
  email: z.email("Please enter a valid email address").max(254),
});

export async function POST(req: Request) {
  if (!ADMIN_EMAIL) {
    return Response.json(
      { error: "Admin email is not configured." },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = androidBetaOptInSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  try {
    await connectDB();
    await AndroidBetaSignup.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true },
    );
  } catch (e) {
    console.error("[android-beta-optin] persist signup:", e);
  }

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[AiXpense] Android Closed Beta Opt-In`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2 style="margin-bottom: 8px;">New Android Closed Beta Opt-In</h2>
        <p style="margin: 0 0 12px;">
          Someone requested access to the AiXpense Android closed beta.
        </p>
        <p style="margin: 0;">
          <strong>Email:</strong> ${email}
        </p>
      </div>
    `,
    text: `New Android Closed Beta Opt-In\nEmail: ${email}`,
  });

  return Response.json({ success: true });
}
