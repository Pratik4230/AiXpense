import { Subscription } from "@/models/Subscription";
import { db } from "@/lib/db";

export async function checkUserPremiumStatus(userId: string): Promise<boolean> {
  const subscription = await Subscription.findOne({
    userId,
    status: "active",
    currentPeriodEnd: { $gte: new Date() },
  });

  return !!subscription;
}

export async function getUserSubscription(userId: string) {
  return await Subscription.findOne({ userId }).sort({ createdAt: -1 });
}

export async function updateUserPremiumFlag(
  userId: string,
  isPremium: boolean,
) {
  await db
    .collection("user")
    .updateOne({ id: userId }, { $set: { isPremium } });
}
