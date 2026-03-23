import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Budget } from "@/models";
import { CATEGORIES } from "@/constants/expense";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

interface DeleteBudgetParams {
  userId: string;
}

export const createDeleteBudgetTool = ({ userId }: DeleteBudgetParams) =>
  tool({
    description:
      "Delete/remove a monthly budget limit for a specific expense category",
    inputSchema: z.object({
      category: z
        .enum(CATEGORIES)
        .describe("The expense category whose budget should be removed"),
    }),
    execute: async ({ category }) => {
      try {
        await connectDB();

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const result = await Budget.findOneAndDelete({
          userId: userObjectId,
          category,
        });

        if (!result) {
          return {
            success: false,
            error: `No budget found for category "${category}"`,
          };
        }

        return {
          success: true,
          deleted: {
            category: result.category,
            amount: result.amount,
          },
        };
      } catch (e) {
        logger.error("tool_budget_delete_fail", {
          userId,
          error: e,
          data: { category },
        });
        return { success: false, error: "Failed to delete budget" };
      }
    },
  });
