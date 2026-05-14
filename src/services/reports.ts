import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type ReportRange = "1m" | "3m" | "6m" | "1y";
export type ReportMode = "expense" | "income";

export interface OverviewData {
  total: number;
  count: number;
  change: number;
  topCategory: string | null;
  topCategoryAmount: number;
  largestExpense: number;
}

export interface TrendPoint {
  _id: { year: number; month?: number; week?: number; day?: number };
  total: number;
  count: number;
}

export interface CategoryPoint {
  _id: string;
  total: number;
  count: number;
}

export interface BudgetVsActualPoint {
  category: string;
  budget: number;
  spent: number;
}

export interface TopExpense {
  _id: string;
  item: string;
  amount: number;
  category: string;
  date: string;
  currency?: string;
}

export interface ReportsData {
  overview: OverviewData;
  trend: TrendPoint[];
  categories: CategoryPoint[];
  budgetVsActual: BudgetVsActualPoint[] | null;
  topExpenses: TopExpense[];
}

export function useReports(range: ReportRange, mode: ReportMode) {
  return useQuery<ReportsData>({
    queryKey: ["reports", range, mode],
    queryFn: () =>
      api
        .get<ReportsData>(`/reports?range=${range}&mode=${mode}`)
        .then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}
