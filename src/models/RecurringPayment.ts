import mongoose, { Schema, Document, Model } from "mongoose";
import {
  CATEGORIES,
  EXPENSE_TYPES,
  FREQUENCIES,
  type Category,
  type ExpenseType,
  type Frequency,
} from "@/constants/expense";
import { DEFAULT_CURRENCY } from "@/constants/currency";

export { FREQUENCIES, type Frequency };

export interface IRecurringPayment {
  userId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  currency: string;
  category: Category;
  type: ExpenseType;
  frequency: Frequency;
  recurOnDate?: number;
  startDate: Date;
  nextDueDate: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecurringPaymentDocument extends IRecurringPayment, Document {}

const recurringPaymentSchema = new Schema<IRecurringPaymentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
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
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    type: {
      type: String,
      enum: EXPENSE_TYPES,
      required: true,
      default: "expense",
    },
    frequency: {
      type: String,
      enum: FREQUENCIES,
      required: true,
    },
    recurOnDate: {
      type: Number,
      min: 1,
      max: 28,
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

recurringPaymentSchema.index({ userId: 1, isActive: 1 });
recurringPaymentSchema.index({ isActive: 1, nextDueDate: 1 });

export const RecurringPayment: Model<IRecurringPaymentDocument> =
  mongoose.models.recurringpayment ||
  mongoose.model<IRecurringPaymentDocument>("recurringpayment", recurringPaymentSchema);
