/** Lifetime free AI messages granted to new non-premium users. */
export const FREE_LIFETIME_LIMIT = 3;

/** Clamp stored trial balance to the current product limit. */
export function normalizeFreeTrials(
  freeTrials: number | null | undefined,
): number {
  if (freeTrials == null || Number.isNaN(freeTrials)) return 0;
  return Math.max(0, Math.min(freeTrials, FREE_LIFETIME_LIMIT));
}
