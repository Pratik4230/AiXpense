import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { effectivePremium } from "@/lib/premium";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const user = await mongoose.connection.db!.collection("user").findOne(
    { _id: new mongoose.Types.ObjectId(session.user.id) },
    { projection: { isPremium: 1 } },
  );

  if (!user) return new Response("Not found", { status: 404 });

  return Response.json({
    isPremium: effectivePremium({ isPremium: user.isPremium as boolean | undefined }),
  });
}
