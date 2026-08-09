import mongoose, { Schema, Document, Model } from "mongoose";

export type BroadcastStatus = "active" | "completed";

export interface IBroadcastCampaign {
  subject: string;
  body: string;
  sentBy: string;
  status: BroadcastStatus;
  totalUsers: number;
  sentCount: number;
  sentEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBroadcastCampaignDocument
  extends IBroadcastCampaign,
    Document {}

const BroadcastCampaignSchema = new Schema<IBroadcastCampaignDocument>(
  {
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    sentBy: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
      index: true,
    },
    totalUsers: { type: Number, required: true, default: 0 },
    sentCount: { type: Number, required: true, default: 0 },
    sentEmails: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Auto-delete campaign documents 30 days after creation
BroadcastCampaignSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
);

export const BroadcastCampaign: Model<IBroadcastCampaignDocument> =
  mongoose.models.BroadcastCampaign ||
  mongoose.model<IBroadcastCampaignDocument>(
    "BroadcastCampaign",
    BroadcastCampaignSchema
  );
