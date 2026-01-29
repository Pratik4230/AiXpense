export const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "shopping",
  "entertainment",
  "bills",
  "health",
  "education",
  "personal",
  "travel",
  "other",
] as const;

export const EXPENSE_TYPES = ["expense", "income"] as const;

export const PAYMENT_METHODS = [
  "cash",
  "upi",
  "card",
  "netbanking",
  "wallet",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type ExpenseType = (typeof EXPENSE_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
