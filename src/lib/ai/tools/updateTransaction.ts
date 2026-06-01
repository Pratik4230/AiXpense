import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense, Budget } from "@/models";
import { CATEGORIES } from "@/constants/expense";
import mongoose from "mongoose";
import { logger } from "@/lib/logger";
import {
  getUtcMonthRangeHalfOpen,
  parseTransactionDateForStorage,
} from "@/lib/utcDates";

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
        .max(500)
        .describe(
          "The user's original instruction for the update, e.g. 'change amount to 500'",
        ),
      updates: z
        .object({
          item: z.string().max(200).optional().describe("New item name"),
          amount: z.number().optional().describe("New amount in the user's account currency"),
          category: z.enum(CATEGORIES).optional().describe("New category"),
          subcategory: z.string().max(100).optional().describe("New subcategory"),
          date: z
            .string()
            .optional()
            .describe(
              "ISO date (YYYY-MM-DD or full ISO). Calendar dates stored as UTC midnight for that day.",
            ),
          notes: z.string().max(2000).optional().describe("New notes or breakdown"),
          attachments: z.array(z.string()).max(5).optional().describe("New attachments URLs to add"),
        })
        .describe("Fields to update"),
    }),
    execute: async ({ transactionId, userInstruction, updates }) => {
      try {
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
        if (updates.date) updateData.date = parseTransactionDateForStorage(updates.date);
        if (updates.notes !== undefined) updateData.notes = updates.notes;
        if (updates.attachments && updates.attachments.length > 0) {
          updateData.attachments = [
            ...(transaction.attachments || []),
            ...updates.attachments,
          ];
        }

        const now = new Date();
        updateData.rawInput = `${transaction.rawInput} [UPDATED: ${now.toISOString()} - ${userInstruction}]`;

        const updated = await Expense.findByIdAndUpdate(
          transactionId,
          { $set: updateData },
          { returnDocument: "after" },
        );

        let budgetStatus = null;

        if (updated?.type === "expense" && (updates.amount || updates.category)) {
          const effectiveCategory = updated.category;
          const userObjectId = new mongoose.Types.ObjectId(userId);
          const { start, endExclusive: end } = getUtcMonthRangeHalfOpen(now);

          const budget = await Budget.findOne({
            userId: userObjectId,
            category: effectiveCategory,
          }).lean();

          if (budget) {
            const [agg] = await Expense.aggregate([
              {
                $match: {
                  userId: userObjectId,
                  category: effectiveCategory,
                  type: "expense",
                  date: { $gte: start, $lt: end },
                },
              },
              { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
            const spent = agg?.total ?? 0;
            budgetStatus = {
              category: effectiveCategory,
              limit: budget.amount,
              spent,
              percent: Math.round((spent / budget.amount) * 100),
            };
          }
        }

        return {
          success: true,
          previousAmount: transaction.amount,
          transaction: {
            id: transactionId,
            item: updated?.item,
            amount: updated?.amount,
            currency: updated?.currency,
            category: updated?.category,
            subcategory: updated?.subcategory,
            type: updated?.type,
            date: updated?.date?.toISOString(),
            tags: updated?.tags || [],
            notes: updated?.notes,
            attachments: updated?.attachments || [],
          },
          budgetStatus,
        };
      } catch (e) {
        logger.error("tool_update_fail", {
          userId,
          error: e,
          data: { transactionId },
        });
        return { success: false, error: "Failed to update transaction" };
      }
    },
  });
