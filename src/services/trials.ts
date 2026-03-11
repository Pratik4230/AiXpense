import { useQuery, useQueryClient } from "@tanstack/react-query";

interface TrialsData {
  freeTrials: number | null;
  isPremium: boolean;
}

async function fetchTrials(): Promise<TrialsData> {
  const res = await fetch("/api/user/trials");
  if (!res.ok) throw new Error("Failed to fetch trials");
  return res.json();
}

export function useTrials(enabled = true) {
  return useQuery<TrialsData>({
    queryKey: ["user-trials"],
    queryFn: fetchTrials,
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useInvalidateTrials() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["user-trials"] });
}
