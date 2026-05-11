const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** IST calendar date as YYYY-MM-DD for streak / daily counters. */
export function getISTDateKey(d = new Date()): string {
  const istNow = new Date(d.getTime() + IST_OFFSET_MS);
  const y = istNow.getUTCFullYear();
  const m = String(istNow.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istNow.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Signed calendar-day difference between two IST date keys (a → b). */
export function istDateKeysDiffDays(fromKey: string, toKey: string): number {
  const a = new Date(`${fromKey}T00:00:00+05:30`);
  const b = new Date(`${toKey}T00:00:00+05:30`);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function getISTMidnight(): Date {
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);
  return new Date(
    Date.UTC(
      istNow.getUTCFullYear(),
      istNow.getUTCMonth(),
      istNow.getUTCDate(),
      0,
      0,
      0,
      0,
    ) - IST_OFFSET_MS,
  );
}
