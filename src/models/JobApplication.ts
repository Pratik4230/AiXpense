import mongoose, { Document, Model, Schema } from "mongoose";

export const JOB_APPLICATION_STATUSES = [
  "pending",
  "viewed",
  "selected",
  "joined",
  "rejected",
] as const;

export type JobApplicationStatus = (typeof JOB_APPLICATION_STATUSES)[number];

export const JOB_APPLICATION_PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export type JobApplicationPaymentStatus =
  (typeof JOB_APPLICATION_PAYMENT_STATUSES)[number];

export interface IJobApplication {
  roleId: string;
  roleTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: "fresher" | "less_than_1_year" | "1_to_2_years";
  resumeUrl: string;
  githubUrl: string;
  answers: {
    bestProject: string;
    skillsUsed: string;
    technicalProblem: string;
    whyAiXpense: string;
  };
  availability: string;
  expectedSalary: string;
  remoteTimezoneConfirmed: boolean;
  contactConsent: boolean;
  requestFingerprint: string;
  status: JobApplicationStatus;
  payment: {
    status: JobApplicationPaymentStatus;
    amountInPaise: number;
    currency: "INR";
    provider?: "razorpay";
    orderId?: string;
    paymentId?: string;
    paidAt?: Date;
  };
  viewedAt?: Date;
  reviewedAt?: Date;
  interviewScheduledAt?: Date;
  selectedAt?: Date;
  joinedAt?: Date;
  rejectedAt?: Date;
  candidateNotifiedAt?: Date;
  adminNotifiedAt?: Date;
  adminNotes?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobApplicationDocument
  extends IJobApplication,
    Document {}

const jobApplicationSchema = new Schema<IJobApplicationDocument>(
  {
    roleId: { type: String, required: true, trim: true, index: true },
    roleTitle: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    experience: {
      type: String,
      enum: ["fresher", "less_than_1_year", "1_to_2_years"],
      required: true,
    },
    resumeUrl: { type: String, required: true, trim: true },
    githubUrl: { type: String, required: true, trim: true },
    answers: {
      bestProject: { type: String, required: true, trim: true },
      skillsUsed: { type: String, required: true, trim: true },
      technicalProblem: { type: String, required: true, trim: true },
      whyAiXpense: { type: String, required: true, trim: true },
    },
    availability: { type: String, required: true, trim: true },
    expectedSalary: { type: String, required: true, trim: true },
    remoteTimezoneConfirmed: { type: Boolean, required: true, default: false },
    contactConsent: { type: Boolean, required: true, default: false },
    requestFingerprint: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: JOB_APPLICATION_STATUSES,
      required: true,
      default: "pending",
      index: true,
    },
    payment: {
      status: {
        type: String,
        enum: JOB_APPLICATION_PAYMENT_STATUSES,
        required: true,
        default: "pending",
      },
      amountInPaise: { type: Number, required: true, default: 10000 },
      currency: { type: String, enum: ["INR"], required: true, default: "INR" },
      provider: { type: String, enum: ["razorpay"] },
      orderId: { type: String, trim: true },
      paymentId: { type: String, trim: true },
      paidAt: { type: Date },
    },
    viewedAt: { type: Date },
    reviewedAt: { type: Date },
    interviewScheduledAt: { type: Date },
    selectedAt: { type: Date },
    joinedAt: { type: Date },
    rejectedAt: { type: Date },
    candidateNotifiedAt: { type: Date },
    adminNotifiedAt: { type: Date },
    adminNotes: { type: String, trim: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

jobApplicationSchema.index({ roleId: 1, status: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1, roleId: 1, "payment.status": 1, createdAt: -1 });
jobApplicationSchema.index({ requestFingerprint: 1, createdAt: -1 });
jobApplicationSchema.index({ "payment.status": 1, createdAt: -1 });
jobApplicationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const JobApplication: Model<IJobApplicationDocument> =
  (mongoose.models.JobApplication as Model<IJobApplicationDocument>) ||
  mongoose.model<IJobApplicationDocument>("JobApplication", jobApplicationSchema);
