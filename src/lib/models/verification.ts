import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVerificationDocument extends IVerification, Document {
  _id: mongoose.Types.ObjectId;
}

const verificationSchema = new Schema<IVerificationDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    identifier: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

verificationSchema.index({ identifier: 1 });
verificationSchema.index({ expiresAt: 1 });

export const Verification: Model<IVerificationDocument> =
  mongoose.models.verification ||
  mongoose.model<IVerificationDocument>("verification", verificationSchema);
