import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { resolveUserCurrencyCode } from "@/lib/userCurrency";

/**
 * Reads the user's preferred currency from the user collection (source of truth).
 * Prefer this over session.user.currency in API routes to avoid stale JWT/session.
 */
export async function fetchUserCurrencyCodeFromDb(
  userId: string,
): Promise<string> {
  if (!ObjectId.isValid(userId)) {
    return resolveUserCurrencyCode(undefined);
  }

  const doc = await db
    .collection("user")
    .findOne({ _id: new ObjectId(userId) }, { projection: { currency: 1 } });

  return resolveUserCurrencyCode(doc?.currency);
}
