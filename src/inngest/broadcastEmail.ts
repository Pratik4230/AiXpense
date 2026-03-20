import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { broadcastEmail } from "@/lib/email/templates/broadcast";
import { db } from "@/lib/db";

const BATCH_SIZE = 50;

export const broadcastEmailFunction = inngest.createFunction(
  { id: "admin-broadcast-email", retries: 2 },
  { event: "admin/broadcast-email" },
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
        await Promise.all(
          batch.map(({ email, name }) => {
            const { html, text } = broadcastEmail({ name, subject, body });
            return sendEmail({ to: email, subject, html, text });
          })
        );
      });
    }

    return {
      totalSent: users.length,
      batches: batches.length,
      sentBy,
    };
  }
);
