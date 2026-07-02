import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface InsightData {
  id: string;
  periodKey: string;
  content: string;
  totalSpent: number;
  generatedAt: string;
}

export function useLatestInsight(enabled = true) {
  return useQuery<InsightData | null>({
    queryKey: ["insights", "latest"],
    queryFn: () =>
      api.get<InsightData | null>("/insights/latest").then((r) => r.data),
    enabled,
    staleTime: 1000 * 60 * 30,
  });
}
