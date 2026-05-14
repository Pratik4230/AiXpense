import { tool } from "ai";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models";
import { logger } from "@/lib/logger";

interface DeleteTransactionParams {
  userId: string;
}

export const createDeleteTransactionTool = ({
  userId,
}: DeleteTransactionParams) =>
  tool({
    description:
      "Delete an expense or income transaction by its ID. Use this when user wants to delete a transaction that is attached to their message.",
    inputSchema: z.object({
      transactionId: z
        .string()
        .describe("The _id of the transaction to delete"),
      item: z
        .string()
        .describe(
          "Name of the item/source being deleted (for confirmation message)",
        ),
      amount: z
        .number()
        .describe("Amount of the transaction (for confirmation message)"),
      type: z.enum(["expense", "income"]).describe("Type of transaction"),
    }),
    execute: async ({ transactionId, item, amount, type }) => {
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
              "Transaction not found or you don't have permission to delete it",
          };
        }

        await Expense.deleteOne({ _id: transactionId });

        return {
          success: true,
          deleted: {
            id: transactionId,
            item: transaction.item,
            amount: transaction.amount,
            type: transaction.type,
            currency: transaction.currency,
          },
        };
      } catch (e) {
        logger.error("tool_delete_fail", {
          userId,
          error: e,
          data: { transactionId },
        });
        return { success: false, error: "Failed to delete transaction" };
      }
    },
  });
