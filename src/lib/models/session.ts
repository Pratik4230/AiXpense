import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionDocument extends ISession, Document {
  _id: mongoose.Types.ObjectId;
}

const sessionSchema = new Schema<ISessionDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({ token: 1 });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 });

export const Session: Model<ISessionDocument> =
  mongoose.models.session ||
  mongoose.model<ISessionDocument>("session", sessionSchema);
