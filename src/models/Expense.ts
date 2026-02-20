import mongoose, { Schema, Document, Model } from "mongoose";
import {
  CATEGORIES,
  EXPENSE_TYPES,
  type Category,
  type ExpenseType,
} from "@/constants/expense";

export interface IExpense {
  userId: mongoose.Types.ObjectId;
  item: string;
  amount: number;
  category: Category;
  subcategory?: string;
  type: ExpenseType;

  date: Date;
  rawInput: string;
  tags?: string[];
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpenseDocument extends IExpense, Document {}

const expenseSchema = new Schema<IExpenseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    item: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: EXPENSE_TYPES,
      required: true,
      default: "expense",
      index: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    rawInput: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export const Expense: Model<IExpenseDocument> =
  mongoose.models.expense ||
  mongoose.model<IExpenseDocument>("expense", expenseSchema);
