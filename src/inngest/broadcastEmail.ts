import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { broadcastEmail } from "@/lib/email/templates/broadcast";
import { db } from "@/lib/db";

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
    const { subject, body, sentBy } = event.data as {
      subject: string;
      body: string;
      sentBy: string;
    };

    const users = await step.run("fetch-all-users", async () => {
      await connectDB();
      const allUsers = await db
        .collection("user")
        .find(
          { emailVerified: true },
          { projection: { _id: 1, email: 1, name: 1 } }
        )
        .toArray();
      return allUsers.map((u) => ({
        email: u.email as string,
        name: (u.name as string) || "there",
      }));
    });

    const batches: { email: string; name: string }[][] = [];
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      batches.push(users.slice(i, i + BATCH_SIZE));
    }

    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
      await step.run(`send-batch-${batchIdx}`, async () => {
        const batch = batches[batchIdx];
        for (const { email, name } of batch) {
          const { html, text } = broadcastEmail({ name, subject, body });
          await sendEmail({ to: email, subject, html, text });
          await sleep(DELAY_MS);
        }
      });

      await step.sleep(`throttle-${batchIdx}`, "1s");
    }

    return {
      totalSent: users.length,
      batches: batches.length,
      sentBy,
    };
  }
);
