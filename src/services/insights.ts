import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface InsightData {
  id: string;
  periodKey: string;
  content: string;
  totalSpent: number;
  generatedAt: string;
}

export interface ShareImageData {
  imageDataUrl: string;
  caption: string;
}

export interface GenerateShareImageInput {
  insightContent: string;
  periodKey: string;
  totalSpent: number;
  currencyCode?: string;
  currencySymbol?: string;
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

export function useGenerateInsightShareImage() {
  return useMutation({
    mutationFn: (payload: GenerateShareImageInput) =>
      api.post<ShareImageData>("/insights/generate-share-image", payload).then((r) => r.data),
  });
}
