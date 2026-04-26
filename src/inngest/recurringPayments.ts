import { inngest } from "@/inngest/client";
import { connectDB } from "@/lib/db";
import { Expense, RecurringPayment } from "@/models";
import { computeNextDueDate } from "@/lib/recurring";
import { logger } from "@/lib/logger";
import { cron } from "inngest";

export const processRecurringPayments = inngest.createFunction(
  { id: "process-recurring-payments", triggers: [cron("0 1 * * *")] },
  async ({ step }) => {
    return step.run("process-due-payments", async () => {
      await connectDB();

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const due = await RecurringPayment.find({
        isActive: true,
        nextDueDate: { $lte: today },
      }).lean();

      const results = { processed: 0, skipped: 0 };

      for (const rule of due) {
        try {
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          await Expense.create({
            userId: rule.userId,
            item: rule.name,
            amount: rule.amount,
            category: rule.category,
            type: rule.type,
            date: rule.nextDueDate,
            rawInput: `auto:recurring:${rule._id}`,

            notes: rule.notes,
          });

          const nextDueDate = computeNextDueDate(
            rule.nextDueDate,
            rule.frequency,
            rule.recurOnDate ?? undefined,
          );
          await RecurringPayment.findByIdAndUpdate(rule._id, { nextDueDate });
          results.processed++;
        } catch (err) {
          logger.error("inngest_recurring_error", {
            data: { ruleId: String(rule._id) },
            error: err,
          });
          results.skipped++;
        }
      }

      logger.info("inngest_recurring_complete", { data: results });
      return results;
    });
  },
);
