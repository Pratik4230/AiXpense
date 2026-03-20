import { inngest } from "@/inngest/client";
import { onboardingDrip } from "./onboardingDrip";
import { aiCoachWeekly, aiCoachMonthly } from "./aiCoach";
import { cleanupUnverified } from "./cleanupUnverified";
import { broadcastEmailFunction } from "./broadcastEmail";

export const functions = [onboardingDrip, aiCoachWeekly, aiCoachMonthly, cleanupUnverified, broadcastEmailFunction];
export { inngest };
