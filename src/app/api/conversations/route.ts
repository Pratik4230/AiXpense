import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Conversation } from "@/lib/models";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const conversations = await Conversation.find({
    userId: session.user.id,
    isDeleted: false,
  })
    .select("_id title messageCount createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ conversations });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title } = body;

  await connectDB();

  const conversation = await Conversation.create({
    userId: session.user.id,
    title: title || "New Conversation",
    messages: [],
    messageCount: 0,
  });

  return NextResponse.json({
    conversation: {
      _id: conversation._id,
      title: conversation.title,
      messageCount: conversation.messageCount,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    },
  });
}
