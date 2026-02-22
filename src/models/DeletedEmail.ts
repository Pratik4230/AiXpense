import mongoose, { Schema, Model } from "mongoose";

interface IDeletedEmail {
  email: string;
  trialsRemaining: number;
  deletedAt: Date;
}

const DeletedEmailSchema = new Schema<IDeletedEmail>({
  email: { type: String, required: true, unique: true, lowercase: true },
  trialsRemaining: { type: Number, required: true, default: 0 },
  deletedAt: { type: Date, default: Date.now },
});

export const DeletedEmail: Model<IDeletedEmail> =
  mongoose.models.DeletedEmail ||
  mongoose.model<IDeletedEmail>("DeletedEmail", DeletedEmailSchema);
