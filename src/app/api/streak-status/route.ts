import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { buildStreakStatus, type StreakUserFields } from "@/lib/streakMobile";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const user = await mongoose.connection.db!.collection("user").findOne(
    { _id: new mongoose.Types.ObjectId(session.user.id) },
    {
      projection: {
        streakDayKey: 1,
        streakChatsToday: 1,
        streakCount: 1,
        streakLastQualifiedDayKey: 1,
        streakRewardGrantedAt: 1,
        bonusPremiumUntil: 1,
      },
    },
  );

  if (!user) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(buildStreakStatus(user as StreakUserFields));
}
