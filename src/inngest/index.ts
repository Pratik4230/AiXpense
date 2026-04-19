import { inngest } from "@/inngest/client";
import { onboardingDrip } from "./onboardingDrip";
import { aiCoachWeekly, aiCoachMonthly } from "./aiCoach";
import { cleanupUnverified } from "./cleanupUnverified";
import { broadcastEmailFunction } from "./broadcastEmail";
import { processRecurringPayments } from "./recurringPayments";

export const functions = [
  onboardingDrip,
  aiCoachWeekly,
  aiCoachMonthly,
  cleanupUnverified,
  broadcastEmailFunction,
  processRecurringPayments,
];
export { inngest };
