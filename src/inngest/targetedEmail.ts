import { inngest } from "@/inngest/client";
import { sendEmail } from "@/lib/email";
import { targetedEmail } from "@/lib/email/templates/targeted";

const BATCH_SIZE = 4;
const DELAY_MS = 250;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const targetedEmailFunction = inngest.createFunction(
  { id: "admin-targeted-email", retries: 2 },
  { event: "admin/targeted-email" },
  async ({ event, step }) => {
    const { subject, body, emails, sentBy } = event.data as {
      subject: string;
      body: string;
      emails: string[];
      sentBy: string;
    };

    const batches: string[][] = [];
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      batches.push(emails.slice(i, i + BATCH_SIZE));
    }

    for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
      await step.run(`send-targeted-batch-${batchIdx}`, async () => {
        const batch = batches[batchIdx];
        for (const email of batch) {
          const { html, text } = targetedEmail({ subject, body });
          await sendEmail({ to: email, subject, html, text });
          await sleep(DELAY_MS);
        }
      });

      await step.sleep(`targeted-throttle-${batchIdx}`, "1s");
    }

    return {
      totalSent: emails.length,
      batches: batches.length,
      sentBy,
    };
  }
);
