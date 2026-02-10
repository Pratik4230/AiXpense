import mongoose, { Schema, Document, Model } from "mongoose";
import { MAX_MESSAGES_PER_CONVERSATION } from "@/lib/constants/conversation";

export { MAX_MESSAGES_PER_CONVERSATION };

export interface IMessage {
  id: string;
  role: "user" | "assistant";
  parts: object[];
  createdAt: Date;
}

export interface IConversation {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  messageCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationDocument extends IConversation, Document {}

const messageSchema = new Schema<IMessage>(
  {
    id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    parts: {
      type: [Schema.Types.Mixed],
      required: true,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const conversationSchema = new Schema<IConversationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "New Conversation",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ userId: 1, isDeleted: 1, updatedAt: -1 });

export const Conversation: Model<IConversationDocument> =
  mongoose.models.conversation ||
  mongoose.model<IConversationDocument>("conversation", conversationSchema);
