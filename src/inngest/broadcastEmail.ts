import { inngest } from "@/inngest/client";
import { connectDB, db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { broadcastEmail } from "@/lib/email/templates/broadcast";
import { BroadcastCampaign } from "@/models";
import mongoose from "mongoose";

const DAILY_LIMIT = 25;
const BATCH_SIZE = 4;
const DELAY_MS = 250;
const NEXT_DAY_MS = 25 * 60 * 60 * 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type DayBatchUser = { id: string; email: string; name: string };

type DayBatchResult =
  | { done: true; batch: DayBatchUser[] }
  | {
      done: false;
      batch: DayBatchUser[];
      subject: string;
      body: string;
      sentCount: number;
      totalUsers: number;
    };

export const broadcastEmailFunction = inngest.createFunction(
  {
    id: "admin-broadcast-email",
    retries: 2,
    concurrency: { limit: 1, key: "event.data.campaignId" },
    triggers: [{ event: "admin/broadcast-email" }],
  },
  async ({ event, step }) => {
    const { campaignId } = event.data as { campaignId: string };

    const batchInfo = await step.run("fetch-day-batch", async () => {
      await connectDB();

      const campaign = await BroadcastCampaign.findById(campaignId).lean();
      if (!campaign || campaign.status === "completed") {
        return { done: true, batch: [] } satisfies DayBatchResult;
      }

      let totalUsers = campaign.totalUsers;
      if (totalUsers === 0) {
        totalUsers = await db
          .collection("user")
          .countDocuments({ emailVerified: true });
        await BroadcastCampaign.findByIdAndUpdate(campaignId, { totalUsers });
      }

      const query: Record<string, unknown> = { emailVerified: true };

      if (campaign.lastProcessedUserId) {
        query._id = {
          $gt: new mongoose.Types.ObjectId(campaign.lastProcessedUserId),
        };
      } else if (campaign.sentEmails?.length) {
        // Legacy campaigns created before cursor-based pagination
        query.email = { $nin: campaign.sentEmails };
      }

      const users = await db
        .collection("user")
        .find(query, { projection: { _id: 1, email: 1, name: 1 } })
        .sort({ _id: 1 })
        .limit(DAILY_LIMIT)
        .toArray();

      if (users.length === 0) {
        await BroadcastCampaign.findByIdAndUpdate(campaignId, {
          status: "completed",
        });
        return { done: true, batch: [] } satisfies DayBatchResult;
      }

      const batch: DayBatchUser[] = users.map((u) => ({
        id: u._id.toString(),
        email: u.email as string,
        name: (u.name as string) || "there",
      }));

      return {
        done: false,
        batch,
        subject: campaign.subject,
        body: campaign.body,
        sentCount: campaign.sentCount,
        totalUsers,
      } satisfies DayBatchResult;
    });

    if (batchInfo.done || batchInfo.batch.length === 0) {
      return await step.run("final-summary", async () => {
        await connectDB();
        const campaign = await BroadcastCampaign.findById(campaignId).lean();
        return {
          totalSent: campaign?.sentCount ?? 0,
          status: campaign?.status ?? "completed",
          sentBy: campaign?.sentBy ?? "",
        };
      });
    }

    const { batch, subject, body, sentCount, totalUsers } = batchInfo;

    const batches: DayBatchUser[][] = [];
    for (let i = 0; i < batch.length; i += BATCH_SIZE) {
      batches.push(batch.slice(i, i + BATCH_SIZE));
    }

    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
      await step.run(`send-batch-${batchIdx}`, async () => {
        for (const { email, name } of batches[batchIdx]) {
          const { html, text } = broadcastEmail({ name, subject, body });
          await sendEmail({ to: email, subject, html, text });
          await sleep(DELAY_MS);
        }
      });

      if (batchIdx < batches.length - 1) {
        await step.sleep(`throttle-${batchIdx}`, "1s");
      }
    }

    const lastUserId = batch[batch.length - 1].id;
    const isComplete =
      batch.length < DAILY_LIMIT || sentCount + batch.length >= totalUsers;

    await step.run("update-campaign", async () => {
      await connectDB();

      const update: Record<string, unknown> = {
        $inc: { sentCount: batch.length },
        lastProcessedUserId: lastUserId,
      };

      if (isComplete) {
        await BroadcastCampaign.findByIdAndUpdate(campaignId, {
          ...update,
          status: "completed",
        });
      } else {
        await BroadcastCampaign.findByIdAndUpdate(campaignId, update);
      }
    });

    if (!isComplete) {
      await step.run("schedule-next-day", async () => {
        await inngest.send({
          name: "admin/broadcast-email",
          data: { campaignId },
          ts: Date.now() + NEXT_DAY_MS,
        });
      });
    }

    return await step.run("final-summary", async () => {
      await connectDB();
      const campaign = await BroadcastCampaign.findById(campaignId).lean();
      return {
        totalSent: campaign?.sentCount ?? 0,
        status: campaign?.status ?? "completed",
        sentBy: campaign?.sentBy ?? "",
        scheduledNextDay: !isComplete,
      };
    });
  }
);
