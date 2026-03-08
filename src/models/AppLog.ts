import mongoose, { Schema, Document, Model } from "mongoose";

export type LogLevel = "info" | "warn" | "error";

export type LogEvent =
  | "chat_complete"
  | "chat_quota_exceeded"
  | "chat_unauthorized"
  | "ai_usage_record_fail"
  | "inngest_coach_complete"
  | "inngest_cleanup_complete"
  | "razorpay_webhook"
  | "razorpay_webhook_fail"
  | "razorpay_sub_created"
  | "razorpay_sub_create_fail"
  | "razorpay_sub_cancelled"
  | "razorpay_sub_cancel_fail"
  | "issue_created"
  | "email_fail"
  | "search_specialist_fail"
  | "search_query_fail"
  | "tool_save_expense_fail"
  | "tool_save_income_fail"
  | "tool_delete_fail"
  | "tool_update_fail"
  | "voice_sarvam_fail";

export interface IAppLog extends Document {
  level: LogLevel;
  event: LogEvent;
  userId?: string;
  data?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
}

const AppLogSchema = new Schema<IAppLog>(
  {
    level: { type: String, enum: ["info", "warn", "error"], required: true },
    event: { type: String, required: true },
    userId: { type: String, index: true },
    data: { type: Schema.Types.Mixed },
    error: { type: String },
  },
  { timestamps: true },
);

AppLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 864000 });
AppLogSchema.index({ level: 1, createdAt: -1 });
AppLogSchema.index({ event: 1, createdAt: -1 });

export const AppLog: Model<IAppLog> =
  mongoose.models.AppLog || mongoose.model<IAppLog>("AppLog", AppLogSchema);
