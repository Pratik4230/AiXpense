import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Conversation, MAX_MESSAGES_PER_CONVERSATION } from "@/models";
import type { IMessage } from "@/models/Conversation";
import { z } from "zod";

const patchConversationSchema = z.object({
  title: z.string().max(200).optional(),
  messages: z.array(z.unknown()).optional(),
  appendMessages: z.array(z.unknown()).optional(),
});

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
  })
    .select("_id title messages messageCount updatedAt")
    .lean();

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
  const parsed = patchConversationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { title, messages, appendMessages } = parsed.data;

  await connectDB();

  if (appendMessages && appendMessages.length > 0) {
    const result = await Conversation.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
        isDeleted: false,
        messageCount: { $lt: MAX_MESSAGES_PER_CONVERSATION },
      },
      {
        $push: { messages: { $each: appendMessages } },
        $inc: { messageCount: appendMessages.length },
      },
      { projection: { _id: 1, title: 1, messageCount: 1, updatedAt: 1 }, returnDocument: "after" },
    );

    if (!result) {
      const exists = await Conversation.exists({
        _id: id,
        userId: session.user.id,
        isDeleted: false,
      });

      if (!exists) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: "Message limit reached",
          maxMessages: MAX_MESSAGES_PER_CONVERSATION,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      conversation: {
        _id: result._id,
        title: result.title,
        messageCount: result.messageCount,
        updatedAt: result.updatedAt,
      },
    });
  }

  if (title || messages) {
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
      conversation.messages = messages as IMessage[];
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

  return NextResponse.json({ error: "No update data" }, { status: 400 });
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
