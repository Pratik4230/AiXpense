import { inngest } from "@/inngest/client";
import { onboardingDrip } from "./onboardingDrip";
import { aiCoachWeekly, aiCoachMonthly } from "./aiCoach";
import { cleanupUnverified } from "./cleanupUnverified";

export const functions = [onboardingDrip, aiCoachWeekly, aiCoachMonthly, cleanupUnverified];
export { inngest };
