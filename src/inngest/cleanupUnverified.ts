import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export const cleanupUnverified = inngest.createFunction(
  { id: "cleanup-unverified-users" },
  { cron: "0 2 1 * *" },
  async ({ step }) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const deleted = await step.run("delete-unverified-users", async () => {
      await connectDB();
      const result = await db.collection("user").deleteMany({
        emailVerified: false,
        createdAt: { $lt: thirtyDaysAgo },
      });
      return result.deletedCount;
    });

    logger.info("inngest_cleanup_complete", {
      data: { deleted },
    });

    return { deleted };
  },
);
