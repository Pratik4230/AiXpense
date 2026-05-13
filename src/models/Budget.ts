import mongoose, { Schema, Document, Model } from "mongoose";
import { CATEGORIES, type Category } from "@/constants/expense";
import { DEFAULT_CURRENCY } from "@/constants/currency";

export interface IBudget {
  userId: mongoose.Types.ObjectId;
  category: Category;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBudgetDocument extends IBudget, Document {}

const budgetSchema = new Schema<IBudgetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
      required: true,
    },
  },
  { timestamps: true },
);

budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export const Budget: Model<IBudgetDocument> =
  mongoose.models.budget ||
  mongoose.model<IBudgetDocument>("budget", budgetSchema);
