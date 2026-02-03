import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, updateTransaction } from "@/actions/transactions";
import { api } from "@/lib/api";

interface Transaction {
  _id: string;
  type: "expense" | "income";
  item: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
}

interface TransactionsResponse {
  success: boolean;
  count: number;
  transactions: Transaction[];
}

interface TransactionFilters {
  type?: string;
  category?: string;
  period?: string;
}

async function fetchTransactions(
  filters: TransactionFilters,
): Promise<TransactionsResponse> {
  const params: Record<string, string> = {};
  if (filters.type && filters.type !== "all") params.type = filters.type;
  if (filters.category && filters.category !== "all")
    params.category = filters.category;
  if (filters.period) params.period = filters.period;

  const { data } = await api.get<TransactionsResponse>("/transactions", {
    params,
  });
  return data;
}

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        item?: string;
        amount?: number;
        category?: string;
        subcategory?: string;
      };
    }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
