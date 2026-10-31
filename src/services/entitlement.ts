import { useQuery } from "@tanstack/react-query";

export interface EntitlementData {
  isPremium: boolean;
}

export const ENTITLEMENT_QUERY_KEY = ["user-entitlement"] as const;

async function fetchEntitlement(): Promise<EntitlementData> {
  const response = await fetch("/api/user/entitlement");
  if (!response.ok) throw new Error("Failed to fetch account access");
  return response.json() as Promise<EntitlementData>;
}

export function useEntitlement(enabled = true) {
  return useQuery<EntitlementData>({
    queryKey: ENTITLEMENT_QUERY_KEY,
    queryFn: fetchEntitlement,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
