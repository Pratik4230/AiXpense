export const RAZORPAY_PLANS = {
  monthly: {
    name: "AiXpense Premium - Monthly",
    amount: 49900,
    currency: "INR",
    period: "monthly" as const,
    interval: 1,
  },
  yearly: {
    name: "AiXpense Premium - Yearly",
    amount: 399900,
    currency: "INR",
    period: "yearly" as const,
    interval: 1,
  },
} as const;

export type PlanType = keyof typeof RAZORPAY_PLANS;
