import { inngest } from "@/inngest/client";
import { connectDB, db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { broadcastEmail } from "@/lib/email/templates/broadcast";
import { BroadcastCampaign } from "@/models";

const DAILY_LIMIT = 25;
const BATCH_SIZE = 4;
const DELAY_MS = 250;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const broadcastEmailFunction = inngest.createFunction(
  {
    id: "admin-broadcast-email",
    retries: 2,
    triggers: [{ event: "admin/broadcast-email" }],
  },
  async ({ event, step }) => {
    const { campaignId } = event.data as { campaignId: string };

    let keepGoing = true;

    while (keepGoing) {
      const dayBatch = await step.run("fetch-day-batch", async () => {
        await connectDB();

        const campaign = await BroadcastCampaign.findById(campaignId).lean();
        if (!campaign || campaign.status === "completed") return null;

        const allUsers = await db
          .collection("user")
          .find(
            { emailVerified: true },
            { projection: { _id: 1, email: 1, name: 1 } }
          )
          .toArray();

        const totalUsers = allUsers.length;

        if (campaign.totalUsers === 0) {
          await BroadcastCampaign.findByIdAndUpdate(campaignId, { totalUsers });
        }

        const sentSet = new Set(campaign.sentEmails);
        const pending = allUsers.filter((u) => !sentSet.has(u.email as string));

        if (pending.length === 0) return null;

        return pending.slice(0, DAILY_LIMIT).map((u) => ({
          email: u.email as string,
          name: (u.name as string) || "there",
        }));
      });

      if (!dayBatch || dayBatch.length === 0) {
        keepGoing = false;
        break;
      }

      const batches: { email: string; name: string }[][] = [];
      for (let i = 0; i < dayBatch.length; i += BATCH_SIZE) {
        batches.push(dayBatch.slice(i, i + BATCH_SIZE));
      }

      for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
        await step.run(`send-batch-${batchIdx}`, async () => {
          const campaign = await BroadcastCampaign.findById(campaignId).lean();
          if (!campaign) return;

          const { subject, body } = campaign;
          const batch = batches[batchIdx];

          for (const { email, name } of batch) {
            const { html, text } = broadcastEmail({ name, subject, body });
            await sendEmail({ to: email, subject, html, text });
            await sleep(DELAY_MS);
          }
        });

        await step.sleep(`throttle-${batchIdx}`, "1s");
      }

      const isComplete = await step.run("update-campaign", async () => {
        await connectDB();

        const sentEmailsToday = dayBatch.map((u) => u.email);

        const updated = await BroadcastCampaign.findByIdAndUpdate(
          campaignId,
          {
            $push: { sentEmails: { $each: sentEmailsToday } },
            $inc: { sentCount: sentEmailsToday.length },
          },
          { new: true }
        ).lean();

        if (!updated) return true;

        const done = updated.sentCount >= updated.totalUsers;
        if (done) {
          await BroadcastCampaign.findByIdAndUpdate(campaignId, {
            status: "completed",
          });
        }
        return done;
      });

      if (isComplete) {
        keepGoing = false;
        break;
      }

      await step.sleep("wait-next-day", "25h");
    }

    const summary = await step.run("final-summary", async () => {
      await connectDB();
      const campaign = await BroadcastCampaign.findById(campaignId).lean();
      return {
        totalSent: campaign?.sentCount ?? 0,
        status: campaign?.status ?? "completed",
        sentBy: campaign?.sentBy ?? "",
      };
    });

    return summary;
  }
);
