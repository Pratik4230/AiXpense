import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInsight {
  userId: mongoose.Types.ObjectId;
  periodKey: string;
  content: string;
  tokensUsed: number;
  totalSpent: number;
  generatedAt: Date;
}

export interface IInsightDocument extends IInsight, Document {}

const insightSchema = new Schema<IInsightDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    periodKey: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

insightSchema.index({ userId: 1, periodKey: 1 }, { unique: true });

export const Insight: Model<IInsightDocument> =
  mongoose.models.insight ||
  mongoose.model<IInsightDocument>("insight", insightSchema);
