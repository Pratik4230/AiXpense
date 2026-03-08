import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import { CATEGORIES } from "@/constants/expense";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

interface SaveIncomeParams {
  userId: string;
  rawInput: string;
}

export const createSaveIncomeTool = ({ userId, rawInput }: SaveIncomeParams) =>
  tool({
    description: "Save income (money received) to the database",
    inputSchema: z.object({
      source: z.string().describe("Source of the income"),
      amount: z.number().describe("The amount received in INR"),
      category: z.enum(CATEGORIES).describe("Category of the income"),
      subcategory: z
        .string()
        .optional()
        .describe("More specific subcategory if mentioned"),
      tags: z
        .array(z.string())
        .optional()
        .describe("Optional tags for the income"),
    }),
    execute: async ({ source, amount, category, subcategory, tags }) => {
      try {
        await connectDB();

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const income = await Expense.create({
          userId: userObjectId,
          item: source,
          amount,
          category,
          subcategory,
          type: "income",
          date: new Date(),
          rawInput,
          tags: tags || [],
        });

        return {
          success: true,
          type: "income",
          income: {
            id: income._id.toString(),
            source: income.item,
            amount: income.amount,
            category: income.category,
            subcategory: income.subcategory,
            tags: income.tags,
            date: income.date.toISOString(),
          },
        };
      } catch (e) {
        logger.error("tool_save_income_fail", {
          userId,
          error: e,
          data: { source, amount, category },
        });
        return { success: false, error: "Failed to save income" };
      }
    },
  });
