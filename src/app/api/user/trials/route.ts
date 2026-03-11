import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getISTMidnight } from "@/lib/ist";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const todayISTMidnight = getISTMidnight();

  const user = await db.collection("user").findOne(
    { _id: new ObjectId(session.user.id) },
    { projection: { freeTrials: 1, freeTrialResetAt: 1, isPremium: 1 } },
  );

  if (!user) {
    return new Response("Not found", { status: 404 });
  }

  if (user.isPremium) {
    return Response.json({ freeTrials: null, isPremium: true });
  }

  const lastReset = user.freeTrialResetAt
    ? new Date(user.freeTrialResetAt)
    : new Date(0);

  const needsReset = lastReset < todayISTMidnight;
  const freeTrials = needsReset ? 7 : (user.freeTrials ?? 0);

  return Response.json({ freeTrials, isPremium: false });
}
