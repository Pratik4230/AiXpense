import { inngest } from "@/inngest/client";
import { notifyPaidJobApplication } from "@/lib/careers/notifications";

export const jobApplicationEmailFunction = inngest.createFunction(
  {
    id: "job-application-email",
    retries: 3,
    concurrency: { limit: 1, key: "event.data.applicationId" },
    triggers: [{ event: "careers/job-application-paid" }],
  },
  async ({ event, step }) => {
    const { applicationId } = event.data as { applicationId: string };

    return step.run("send-application-emails", async () =>
      notifyPaidJobApplication(applicationId),
    );
  },
);
