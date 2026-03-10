import mongoose, { Schema, Document, Model } from "mongoose";

export type IssueType = "bug" | "feature" | "other";
export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";

export interface IIssue {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  mediaUrls: string[];
  mediaFileIds: string[];
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIssueDocument extends IIssue, Document {}

const issueSchema = new Schema<IIssueDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ["bug", "feature", "other"],
      required: true,
      default: "bug",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      required: true,
      default: "open",
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    mediaFileIds: {
      type: [String],
      default: [],
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  { timestamps: true },
);

export const Issue: Model<IIssueDocument> =
  mongoose.models.issue || mongoose.model<IIssueDocument>("issue", issueSchema);
