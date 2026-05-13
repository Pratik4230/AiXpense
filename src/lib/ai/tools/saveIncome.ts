import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import { CATEGORIES } from "@/constants/expense";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";
import { parseTransactionDateForStorage } from "@/lib/utcDates";

interface SaveIncomeParams {
  userId: string;
  rawInput: string;
  currency: string;
}

export const createSaveIncomeTool = ({
  userId,
  rawInput,
  currency,
}: SaveIncomeParams) =>
  tool({
    description: "Save income (money received) to the database",
    inputSchema: z.object({
      source: z.string().describe("Source of the income"),
      amount: z
        .number()
        .describe(`The amount received in the user's account currency (${currency})`),
      category: z.enum(CATEGORIES).describe("Category of the income"),
      subcategory: z
        .string()
        .optional()
        .describe("More specific subcategory if mentioned"),
      tags: z
        .array(z.string())
        .optional()
        .describe("Optional tags for the income"),
      date: z
        .string()
        .optional()
        .describe(
          "ISO date (YYYY-MM-DD or full ISO). Calendar dates are stored as UTC midnight for that day.",
        ),
      notes: z
        .string()
        .optional()
        .describe("Additional details or breakdown of the income"),
      attachments: z
        .array(z.string())
        .optional()
        .describe("Array of image or document URLs associated with this transaction"),
    }),
    execute: async ({ source, amount, category, subcategory, tags, date, notes, attachments }) => {
      try {
        await connectDB();

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const income = await Expense.create({
          userId: userObjectId,
          item: source,
          amount,
          currency,
          category,
          subcategory,
          type: "income",
          date: parseTransactionDateForStorage(date),
          rawInput,
          tags: tags || [],
          notes,
          attachments: attachments || [],
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
            notes: income.notes,
            attachments: income.attachments,
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
