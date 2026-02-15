import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Conversation, MAX_MESSAGES_PER_CONVERSATION } from "@/lib/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectDB();

  const conversation = await Conversation.findOne({
    _id: id,
    userId: session.user.id,
    isDeleted: false,
  }).lean();

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ conversation });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, messages } = body;

  await connectDB();

  const conversation = await Conversation.findOne({
    _id: id,
    userId: session.user.id,
    isDeleted: false,
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }

  if (title) {
    conversation.title = title;
  }

  if (messages) {
    if (messages.length > MAX_MESSAGES_PER_CONVERSATION) {
      return NextResponse.json(
        {
          error: "Message limit reached",
          maxMessages: MAX_MESSAGES_PER_CONVERSATION,
        },
        { status: 400 },
      );
    }
    conversation.messages = messages;
    conversation.messageCount = messages.length;
  }

  await conversation.save();

  return NextResponse.json({
    conversation: {
      _id: conversation._id,
      title: conversation.title,
      messageCount: conversation.messageCount,
      updatedAt: conversation.updatedAt,
    },
  });
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectDB();

  const result = await Conversation.updateOne(
    {
      _id: id,
      userId: session.user.id,
    },
    { $set: { isDeleted: true } },
  );

  if (result.matchedCount === 0) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
