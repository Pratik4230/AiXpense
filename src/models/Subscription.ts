import mongoose from "mongoose";

export type BillingProvider = "razorpay" | "dodo";

export interface ISubscription extends mongoose.Document {
  userId: string;
  billingProvider: BillingProvider;
  plan: "monthly" | "yearly";
  status: "created" | "active" | "cancelled" | "expired" | "past_due";
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
  razorpayPlanId?: string;
  dodoSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    billingProvider: {
      type: String,
      enum: ["razorpay", "dodo"],
      default: "razorpay",
    },
    plan: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "active", "cancelled", "expired", "past_due"],
      required: true,
      default: "created",
    },
    razorpaySubscriptionId: {
      type: String,
      required: false,
      sparse: true,
      unique: true,
    },
    razorpayCustomerId: {
      type: String,
      required: false,
    },
    razorpayPlanId: {
      type: String,
      required: false,
    },
    dodoSubscriptionId: {
      type: String,
      required: false,
      sparse: true,
      unique: true,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Subscription =
  (mongoose.models.Subscription as mongoose.Model<ISubscription>) ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);
