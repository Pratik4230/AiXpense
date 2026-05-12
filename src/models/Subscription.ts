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

/** Unique only when the id is a real string — avoids E11000 on many docs with `razorpaySubscriptionId: null`. */
subscriptionSchema.index(
  { razorpaySubscriptionId: 1 },
  {
    name: "razorpaySubscriptionId_1",
    unique: true,
    partialFilterExpression: {
      razorpaySubscriptionId: { $exists: true, $type: "string" },
    },
  },
);

subscriptionSchema.index(
  { dodoSubscriptionId: 1 },
  {
    name: "dodoSubscriptionId_1",
    unique: true,
    partialFilterExpression: {
      dodoSubscriptionId: { $exists: true, $type: "string" },
    },
  },
);

export const Subscription =
  (mongoose.models.Subscription as mongoose.Model<ISubscription>) ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);
