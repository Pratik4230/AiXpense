import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  idToken?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountDocument extends IAccount, Document {
  _id: mongoose.Types.ObjectId;
}

const accountSchema = new Schema<IAccountDocument>(
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
    accountId: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    accessTokenExpiresAt: {
      type: Date,
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
    scope: {
      type: String,
    },
    idToken: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ userId: 1 });
accountSchema.index({ providerId: 1, accountId: 1 });

export const Account: Model<IAccountDocument> =
  mongoose.models.account ||
  mongoose.model<IAccountDocument>("account", accountSchema);
