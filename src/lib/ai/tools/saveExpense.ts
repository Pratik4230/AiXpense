import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense } from "@/lib/models";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/constants/expense";

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
      paymentMethod: z
        .enum(PAYMENT_METHODS)
        .optional()
        .describe("Payment method if explicitly mentioned"),
    }),
    execute: async ({
      item,
      amount,
      category,
      subcategory,
      tags,
      paymentMethod,
    }) => {
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
        paymentMethod,
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
          date: expense.date.toISOString(),
        },
      };
    },
  });
