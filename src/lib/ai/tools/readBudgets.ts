import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Budget, Expense } from "@/models";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

interface ReadBudgetsParams {
  userId: string;
}

function getMonthRange() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

export const createReadBudgetsTool = ({ userId }: ReadBudgetsParams) =>
  tool({
    description:
      "Fetch all budgets for the user with current month spending for each category",
    inputSchema: z.object({}),
    execute: async () => {
      try {
        await connectDB();

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const { start, end } = getMonthRange();

        const [budgets, spendAgg] = await Promise.all([
          Budget.find({ userId: userObjectId }).lean(),
          Expense.aggregate([
            {
              $match: {
                userId: userObjectId,
                type: "expense",
                date: { $gte: start, $lt: end },
              },
            },
            { $group: { _id: "$category", spent: { $sum: "$amount" } } },
          ]),
        ]);

        if (budgets.length === 0) {
          return { success: true, budgets: [], message: "No budgets set" };
        }

        const spendMap = new Map<string, number>(
          spendAgg.map((s) => [s._id as string, s.spent as number]),
        );

        const result = budgets.map((b) => {
          const spent = spendMap.get(b.category) ?? 0;
          return {
            category: b.category,
            limit: b.amount,
            spent,
            percent: Math.round((spent / b.amount) * 100),
          };
        });

        return { success: true, budgets: result };
      } catch (e) {
        logger.error("tool_budget_read_fail", {
          userId,
          error: e,
        });
        return { success: false, error: "Failed to fetch budgets" };
      }
    },
  });
