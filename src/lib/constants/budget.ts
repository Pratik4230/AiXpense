export const BUDGET_PERIODS = ["daily", "weekly", "monthly", "yearly"] as const;

export type BudgetPeriod = (typeof BUDGET_PERIODS)[number];
