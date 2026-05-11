import mongoose from "mongoose";

export interface IAndroidBetaSignup {
  email: string;
  createdAt: Date;
}

const androidBetaSignupSchema = new mongoose.Schema<IAndroidBetaSignup>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

androidBetaSignupSchema.index({ email: 1 }, { unique: true });

export const AndroidBetaSignup =
  (mongoose.models.AndroidBetaSignup as mongoose.Model<IAndroidBetaSignup>) ||
  mongoose.model<IAndroidBetaSignup>("AndroidBetaSignup", androidBetaSignupSchema);
