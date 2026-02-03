import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense } from "@/lib/models";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/constants/expense";

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
      paymentMethod: z
        .enum(PAYMENT_METHODS)
        .optional()
        .describe("Payment method if explicitly mentioned"),
    }),
    execute: async ({
      source,
      amount,
      category,
      subcategory,
      tags,
      paymentMethod,
    }) => {
      await connectDB();

      const income = await Expense.create({
        userId,
        item: source,
        amount,
        category,
        subcategory,
        type: "income",
        date: new Date(),
        rawInput,
        tags: tags || [],
        paymentMethod,
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
          date: income.date.toISOString(),
        },
      };
    },
  });
