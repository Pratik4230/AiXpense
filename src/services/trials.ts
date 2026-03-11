import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export interface TrialsData {
  freeTrials: number | null;
  isPremium: boolean;
}

export const TRIALS_QUERY_KEY = ["user-trials"] as const;

async function fetchTrials(): Promise<TrialsData> {
  const res = await fetch("/api/user/trials");
  if (!res.ok) throw new Error("Failed to fetch trials");
  return res.json();
}

export function useTrials(enabled = true) {
  return useQuery<TrialsData>({
    queryKey: TRIALS_QUERY_KEY,
    queryFn: fetchTrials,
    enabled,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useTrialActions() {
  const queryClient = useQueryClient();

  const optimisticDecrement = useCallback(() => {
    queryClient.setQueryData<TrialsData>(TRIALS_QUERY_KEY, (prev) => {
      if (!prev || prev.isPremium || prev.freeTrials === null) return prev;
      return { ...prev, freeTrials: Math.max(0, prev.freeTrials - 1) };
    });
  }, [queryClient]);

  const invalidateTrials = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: TRIALS_QUERY_KEY });
  }, [queryClient]);

  return { optimisticDecrement, invalidateTrials };
}
