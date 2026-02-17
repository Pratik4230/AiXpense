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
  console.log(
    `[Update Premium Flag] Updating user ${userId} to isPremium: ${isPremium}`,
  );
  const result = await db
    .collection("user")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { isPremium } });
  console.log(
    `[Update Premium Flag] Update result:`,
    result.modifiedCount,
    "documents modified",
  );

  if (result.modifiedCount === 0) {
    console.log(
      `[Update Premium Flag] WARNING: No user found with _id: ${userId}`,
    );
  }
}
