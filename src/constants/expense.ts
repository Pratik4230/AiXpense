export const CATEGORIES = [
  // Expenses
  "food",
  "groceries",
  "transport",
  "shopping",
  "entertainment",
  "subscriptions",
  "bills",
  "utilities",
  "rent",
  "home",
  "health",
  "education",
  "personal",
  "family",
  "travel",
  "insurance",
  "taxes",
  "emi",
  "debt",
  "fees",
  "charity",

  // Financial
  "investment",
  "savings",

  // Income
  "salary",
  "bonus",
  "freelance",
  "business",
  "interest",
  "cashback",
  "rental",
  "refund",
  "gift",

  "other",
] as const;

export const EXPENSE_TYPES = ["expense", "income"] as const;

export const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const;

export type Category = (typeof CATEGORIES)[number];
export type ExpenseType = (typeof EXPENSE_TYPES)[number];
export type Frequency = (typeof FREQUENCIES)[number];
