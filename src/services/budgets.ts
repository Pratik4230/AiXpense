import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category } from "@/constants/expense";

export interface BudgetSummary {
  _id: string;
  category: Category;
  amount: number;
  spent: number;
}

const BUDGETS_KEY = ["budgets"] as const;

export function useBudgets() {
  return useQuery<BudgetSummary[]>({
    queryKey: BUDGETS_KEY,
    queryFn: () => api.get("/budgets").then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { category: Category; amount: number }) =>
      api.post("/budgets", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BUDGETS_KEY }),
  });
}

export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      api.patch(`/budgets/${id}`, { amount }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BUDGETS_KEY }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/budgets/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BUDGETS_KEY }),
  });
}
