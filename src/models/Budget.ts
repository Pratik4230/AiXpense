import mongoose, { Schema, Document, Model } from "mongoose";
import { CATEGORIES, type Category } from "@/constants/expense";

export interface IBudget {
  userId: mongoose.Types.ObjectId;
  category: Category;
  amount: number;
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
  },
  { timestamps: true },
);

budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export const Budget: Model<IBudgetDocument> =
  mongoose.models.budget ||
  mongoose.model<IBudgetDocument>("budget", budgetSchema);
