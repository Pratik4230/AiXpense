import { inngest } from "@/inngest/client";
import { onboardingDrip } from "./onboardingDrip";
import { aiCoachWeekly, aiCoachMonthly } from "./aiCoach";
import { cleanupUnverified } from "./cleanupUnverified";
import { broadcastEmailFunction } from "./broadcastEmail";
import { processRecurringPayments } from "./recurringPayments";
import { targetedEmailFunction } from "./targetedEmail";

export const functions = [
  onboardingDrip,
  aiCoachWeekly,
  aiCoachMonthly,
  cleanupUnverified,
  broadcastEmailFunction,
  targetedEmailFunction,
  processRecurringPayments,
];
export { inngest };
