import { connectDB, db } from "@/lib/db";

/**
 * Public, privacy-safe aggregate used by the marketing page.
 * Only accounts that completed email verification are included.
 */
export async function getVerifiedUserCount(): Promise<number | null> {
  try {
    await connectDB();
    return await db.collection("user").countDocuments({ emailVerified: true });
  } catch (error) {
    console.error("[public-stats] Failed to load verified user count", error);
    return null;
  }
}
