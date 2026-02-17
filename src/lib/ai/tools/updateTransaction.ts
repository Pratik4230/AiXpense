import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import { CATEGORIES } from "@/lib/constants/expense";

interface UpdateTransactionParams {
  userId: string;
}

export const createUpdateTransactionTool = ({
  userId,
}: UpdateTransactionParams) =>
  tool({
    description:
      "Update an expense or income transaction by its ID. Use this when user wants to modify a transaction that is attached to their message.",
    inputSchema: z.object({
      transactionId: z
        .string()
        .describe("The _id of the transaction to update"),
      userInstruction: z
        .string()
        .describe(
          "The user's original instruction for the update, e.g. 'change amount to 500'",
        ),
      updates: z
        .object({
          item: z.string().optional().describe("New item name"),
          amount: z.number().optional().describe("New amount"),
          category: z.enum(CATEGORIES).optional().describe("New category"),
          subcategory: z.string().optional().describe("New subcategory"),
        })
        .describe("Fields to update"),
    }),
    execute: async ({ transactionId, userInstruction, updates }) => {
      await connectDB();

      const transaction = await Expense.findOne({
        _id: transactionId,
        userId,
      });

      if (!transaction) {
        return {
          success: false,
          error:
            "Transaction not found or you don't have permission to update it",
        };
      }

      const updateData: Record<string, unknown> = {};
      if (updates.item) updateData.item = updates.item;
      if (updates.amount) updateData.amount = updates.amount;
      if (updates.category) updateData.category = updates.category;
      if (updates.subcategory !== undefined)
        updateData.subcategory = updates.subcategory;

      const now = new Date();
      updateData.rawInput = `${transaction.rawInput} [UPDATED: ${now.toISOString()} - ${userInstruction}]`;

      const updated = await Expense.findByIdAndUpdate(
        transactionId,
        { $set: updateData },
        { new: true },
      );

      return {
        success: true,
        transaction: {
          id: transactionId,
          item: updated?.item,
          amount: updated?.amount,
          category: updated?.category,
          subcategory: updated?.subcategory,
          type: updated?.type,
          tags: updated?.tags || [],
        },
      };
    },
  });
