import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense, Budget } from "@/models";
import { CATEGORIES } from "@/constants/expense";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";

interface SaveExpenseParams {
  userId: string;
  rawInput: string;
}

function getMonthRange() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

export const createSaveExpenseTool = ({
  userId,
  rawInput,
}: SaveExpenseParams) =>
  tool({
    description: "Save an expense (money spent) to the database",
    inputSchema: z.object({
      item: z.string().describe("What was purchased"),
      amount: z.number().describe("The cost in INR"),
      category: z.enum(CATEGORIES).describe("Category of the expense"),
      subcategory: z
        .string()
        .optional()
        .describe("More specific subcategory if mentioned"),
      tags: z
        .array(z.string())
        .optional()
        .describe("Optional tags for the expense"),
      date: z
        .string()
        .optional()
        .describe("ISO date string if the user mentions a specific date, otherwise omit"),
      notes: z
        .string()
        .optional()
        .describe("Additional details or itemized breakdown of the expense (e.g. from receipt scans)"),
      attachments: z
        .array(z.string())
        .optional()
        .describe("Array of image or document URLs associated with this transaction"),
    }),
    execute: async ({ item, amount, category, subcategory, tags, date, notes, attachments }) => {
      try {
        await connectDB();

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const { start, end } = getMonthRange();

        const [expense, budget] = await Promise.all([
          Expense.create({
            userId: userObjectId,
            item,
            amount,
            category,
            subcategory,
            type: "expense",
            date: date ? new Date(date) : new Date(),
            rawInput,
            tags: tags || [],
            notes,
            attachments: attachments || [],
          }),
          Budget.findOne({ userId: userObjectId, category }).lean(),
        ]);

        let budgetStatus = null;

        if (budget) {
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
          budgetStatus = {
            limit: budget.amount,
            spent,
            percent: Math.round((spent / budget.amount) * 100),
          };
        }

        return {
          success: true,
          type: "expense",
          expense: {
            id: expense._id.toString(),
            item: expense.item,
            amount: expense.amount,
            category: expense.category,
            subcategory: expense.subcategory,
            tags: expense.tags,
            date: expense.date.toISOString(),
            notes: expense.notes,
            attachments: expense.attachments,
          },
          budgetStatus,
        };
      } catch (e) {
        logger.error("tool_save_expense_fail", {
          userId,
          error: e,
          data: { item, amount, category },
        });
        return { success: false, error: "Failed to save expense" };
      }
    },
  });
