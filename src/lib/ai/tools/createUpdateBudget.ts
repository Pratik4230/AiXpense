import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Budget, Expense } from "@/models";
import { CATEGORIES } from "@/constants/expense";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

interface CreateUpdateBudgetParams {
  userId: string;
}

function getMonthRange() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

export const createCreateUpdateBudgetTool = ({
  userId,
}: CreateUpdateBudgetParams) =>
  tool({
    description:
      "Create or update a monthly budget limit for a specific expense category. If a budget already exists for the category, it updates the amount.",
    inputSchema: z.object({
      category: z
        .enum(CATEGORIES)
        .describe("The expense category to set a budget for"),
      amount: z
        .number()
        .positive()
        .describe("The monthly budget limit amount in INR"),
    }),
    execute: async ({ category, amount }) => {
      try {
        await connectDB();

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const existing = await Budget.findOne({
          userId: userObjectId,
          category,
        }).lean();

        const budget = await Budget.findOneAndUpdate(
          { userId: userObjectId, category },
          { amount },
          { upsert: true, returnDocument: "after" },
        );

        const { start, end } = getMonthRange();
        const [agg] = await Expense.aggregate([
          {
            $match: {
              userId: userObjectId,
              category,
              type: "expense",
              date: { $gte: start, $lt: end },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = agg?.total ?? 0;

        return {
          success: true,
          action: existing ? "updated" : "created",
          budget: {
            id: budget._id.toString(),
            category: budget.category,
            amount: budget.amount,
            previousAmount: existing?.amount ?? null,
          },
          currentSpent: spent,
          percent: Math.round((spent / amount) * 100),
        };
      } catch (e) {
        logger.error("tool_budget_upsert_fail", {
          userId,
          error: e,
          data: { category, amount },
        });
        return { success: false, error: "Failed to create/update budget" };
      }
    },
  });
