import { Subscription } from "@/models";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

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
  const result = await db
    .collection("user")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { isPremium } });

  if (result.modifiedCount === 0) {
    console.error(`[updateUserPremiumFlag] No user found with _id: ${userId}`);
  }
}
