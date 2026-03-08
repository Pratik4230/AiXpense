import { inngest } from "@/inngest/client";
import { sendEmail } from "@/lib/email";

export const testEmail = inngest.createFunction(
  { id: "test-email" },
  { cron: "*/5 * * * *" },
  async ({ step }) => {
    const to = process.env.ADMIN_EMAIL!;

    await step.run("send-test-email", async () => {
      await sendEmail({
        to,
        subject: "Inngest Test Email",
        html: `<p>Inngest is working correctly on production.</p><p>Sent at: ${new Date().toISOString()}</p>`,
        text: `Inngest is working correctly. Sent at: ${new Date().toISOString()}`,
      });
    });

    return { sent: true, to };
  },
);
