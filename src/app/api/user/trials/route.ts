import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { getISTMidnight } from "@/lib/ist";
import { effectivePremium } from "@/lib/premium";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const todayISTMidnight = getISTMidnight();

  const user = await mongoose.connection.db!
    .collection("user")
    .findOne(
      { _id: new mongoose.Types.ObjectId(session.user.id) },
      {
        projection: {
          freeTrials: 1,
          freeTrialResetAt: 1,
          isPremium: 1,
          bonusPremiumUntil: 1,
        },
      },
    );

  if (!user) {
    return new Response("Not found", { status: 404 });
  }

  const premium = effectivePremium({
    isPremium: user.isPremium as boolean | undefined,
    bonusPremiumUntil: user.bonusPremiumUntil as Date | undefined,
  });

  if (premium) {
    return Response.json({ freeTrials: null, isPremium: true });
  }

  const lastReset = user.freeTrialResetAt
    ? new Date(user.freeTrialResetAt)
    : new Date(0);

  const needsReset = lastReset < todayISTMidnight;
  const freeTrials = needsReset ? 7 : (user.freeTrials ?? 0);

  return Response.json({ freeTrials, isPremium: false });
}
