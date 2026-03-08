import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAiUsage extends Omit<Document, "model"> {
  userId: string;
  userEmail: string;
  model: string;
  promptTokens: number;
  cachedTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  createdAt: Date;
}

const AiUsageSchema = new Schema<IAiUsage>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    model: { type: String, required: true },
    promptTokens: { type: Number, required: true },
    cachedTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, required: true },
    totalTokens: { type: Number, required: true },
    costUsd: { type: Number, required: true },
  },
  { timestamps: true },
);

AiUsageSchema.index({ createdAt: -1 });
AiUsageSchema.index({ userId: 1, createdAt: -1 });

export const AiUsage: Model<IAiUsage> =
  mongoose.models.AiUsage || mongoose.model<IAiUsage>("AiUsage", AiUsageSchema);
