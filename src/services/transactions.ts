import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Transaction {
  _id: string;
  item: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  date: string;
}

export interface TransactionsPage {
  data: Transaction[];
  total: number;
  page: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface TransactionFilters {
  type: string;
  categories: string[];
  from: string;
  to: string;
  minAmount: string;
  maxAmount: string;
  sort: string;
  order: "asc" | "desc";
}

export function useTransactions(filters: TransactionFilters) {
  const params = new URLSearchParams();
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.categories.length > 0)
    params.set("category", filters.categories.join(","));
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.minAmount) params.set("minAmount", filters.minAmount);
  if (filters.maxAmount) params.set("maxAmount", filters.maxAmount);
  params.set("sort", filters.sort);
  params.set("order", filters.order);

  return useInfiniteQuery<TransactionsPage>({
    queryKey: ["transactions", filters],
    queryFn: ({ pageParam }) => {
      params.set("page", String(pageParam));
      return api
        .get<TransactionsPage>(`/transactions?${params.toString()}`)
        .then((r) => r.data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 2,
  });
}
