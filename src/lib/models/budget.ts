import mongoose, { Schema, Document, Model } from "mongoose";
import { CATEGORIES, type Category } from "@/lib/constants/expense";
import { BUDGET_PERIODS, type BudgetPeriod } from "@/lib/constants/budget";

export interface IBudget {
  userId: mongoose.Types.ObjectId;
  category: Category | "all";
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  isActive: boolean;
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
      enum: [...CATEGORIES, "all"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    period: {
      type: String,
      enum: BUDGET_PERIODS,
      required: true,
      default: "monthly",
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

budgetSchema.index({ userId: 1, category: 1 });
budgetSchema.index({ userId: 1, isActive: 1 });

export const Budget: Model<IBudgetDocument> =
  mongoose.models.budget ||
  mongoose.model<IBudgetDocument>("budget", budgetSchema);
