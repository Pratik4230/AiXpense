import DodoPayments from "dodopayments";
import { getDodoEnvironment } from "@/lib/dodo/config";

let cached: DodoPayments | null = null;

export function getDodoPaymentsClient(): DodoPayments {
  if (!process.env.DODO_PAYMENTS_API_KEY?.trim()) {
    throw new Error("DODO_PAYMENTS_API_KEY is not set");
  }
  if (!cached) {
    cached = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY,
      environment: getDodoEnvironment(),
    });
  }
  return cached;
}
