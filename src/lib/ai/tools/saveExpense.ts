import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import { CATEGORIES } from "@/constants/expense";

interface SaveExpenseParams {
  userId: string;
  rawInput: string;
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
    }),
    execute: async ({ item, amount, category, subcategory, tags }) => {
      await connectDB();

      const expense = await Expense.create({
        userId,
        item,
        amount,
        category,
        subcategory,
        type: "expense",
        date: new Date(),
        rawInput,
        tags: tags || [],
      });

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
        },
      };
    },
  });
