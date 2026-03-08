import { inngest } from "@/inngest/client";
import { onboardingDrip } from "./onboardingDrip";
import { aiCoachWeekly, aiCoachMonthly } from "./aiCoach";
import { cleanupUnverified } from "./cleanupUnverified";
import { testEmail } from "./testEmail";

export const functions = [onboardingDrip, aiCoachWeekly, aiCoachMonthly, cleanupUnverified, testEmail];
export { inngest };
