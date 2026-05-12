import { Subscription } from "@/models";
import { connectDB, db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { logger } from "@/lib/logger";

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
  const id = userId.trim();
  if (!id) {
    logger.warn("premium_flag_update_empty_userId", {});
    return;
  }

  await connectDB();

  const isObjectId = ObjectId.isValid(id);
  let filter: Record<string, unknown>;
  try {
    filter = isObjectId
      ? { $or: [{ _id: new ObjectId(id) }, { id }] }
      : { id };
  } catch {
    filter = { id };
  }

  const result = await db
    .collection("user")
    .updateOne(filter, { $set: { isPremium } });

  if (result.matchedCount === 0) {
    logger.warn("premium_flag_update_user_not_found", {
      data: { userId: id, isObjectId },
    });
  } else if (result.modifiedCount === 0 && result.matchedCount > 0) {
    // idempotent no-op (already isPremium)
  }
}
