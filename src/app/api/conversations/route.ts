import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Conversation } from "@/lib/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  console.log("[Conversations GET] Request received");
  try {
    console.log("[Conversations GET] Getting session...");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("[Conversations GET] Session:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
    });

    if (!session?.user?.id) {
      console.log("[Conversations GET] Unauthorized - no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Conversations GET] Connecting to DB...");
    await connectDB();
    console.log("[Conversations GET] DB connected");

    console.log(
      "[Conversations GET] Fetching conversations for user:",
      session.user.id,
    );
    const conversations = await Conversation.find({
      userId: session.user.id,
      isDeleted: false,
    })
      .select("_id title messageCount createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    console.log(
      "[Conversations GET] Found conversations:",
      conversations.length,
    );
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[Conversations GET] Error:", error);
    console.error(
      "[Conversations GET] Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    return NextResponse.json(
      {
        error: "Failed to fetch conversations",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  console.log("[Conversations POST] Request received");
  try {
    console.log("[Conversations POST] Getting session...");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("[Conversations POST] Session:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
    });

    if (!session?.user?.id) {
      console.log("[Conversations POST] Unauthorized - no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title } = body;
    console.log("[Conversations POST] Request body:", { title });

    console.log("[Conversations POST] Connecting to DB...");
    await connectDB();
    console.log("[Conversations POST] DB connected");

    console.log(
      "[Conversations POST] Creating conversation for user:",
      session.user.id,
    );
    const conversation = await Conversation.create({
      userId: session.user.id,
      title: title || "New Conversation",
      messages: [],
      messageCount: 0,
    });

    console.log("[Conversations POST] Conversation created:", conversation._id);
    return NextResponse.json({
      conversation: {
        _id: conversation._id,
        title: conversation.title,
        messageCount: conversation.messageCount,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error("[Conversations POST] Error:", error);
    console.error(
      "[Conversations POST] Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    return NextResponse.json(
      {
        error: "Failed to create conversation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
