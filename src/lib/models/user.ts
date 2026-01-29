import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 });
userSchema.index({ id: 1 });

export const User: Model<IUserDocument> =
  mongoose.models.user || mongoose.model<IUserDocument>("user", userSchema);
