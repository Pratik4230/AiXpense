import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { BroadcastCampaign } from "@/models";

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

    await connectDB();

    // Lock check — block if any campaign is still active
    const activeCampaign = await BroadcastCampaign.findOne({
      status: "active",
    }).lean();

    if (activeCampaign) {
      return NextResponse.json(
        {
          error:
            "A broadcast campaign is already running. Wait for it to complete before starting a new one.",
        },
        { status: 409 }
      );
    }

    // Create a new campaign document that will track progress + act as dedup store
    const campaign = await BroadcastCampaign.create({
      subject: subject.trim(),
      body: body.trim(),
      sentBy: session.user.email,
      status: "active",
      totalUsers: 0,
      sentCount: 0,
    });

    await inngest.send({
      name: "admin/broadcast-email",
      data: {
        campaignId: campaign._id.toString(),
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
