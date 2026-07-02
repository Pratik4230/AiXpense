/**
 * Calendar math in UTC. MongoDB BSON Date is always UTC; these helpers avoid
 * server-local `new Date(y, m, d)` drift and make “month / day” boundaries explicit.
 */

export function getUtcMonthRangeHalfOpen(anchor: Date = new Date()) {
  const y = anchor.getUTCFullYear();
  const m = anchor.getUTCMonth();
  return {
    start: new Date(Date.UTC(y, m, 1, 0, 0, 0, 0)),
    endExclusive: new Date(Date.UTC(y, m + 1, 1, 0, 0, 0, 0)),
  };
}

export function getUtcYearRangeHalfOpen(anchor: Date = new Date()) {
  const y = anchor.getUTCFullYear();
  return {
    start: new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0)),
    endExclusive: new Date(Date.UTC(y + 1, 0, 1, 0, 0, 0, 0)),
  };
}

/** YYYY-MM key for grouping by UTC calendar month. */
export function utcMonthKey(date: Date): string {
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${mo}`;
}

/** Inclusive end of UTC calendar month (last ms before next month). */
export function getUtcMonthEndInclusive(anchor: Date = new Date()) {
  const { endExclusive } = getUtcMonthRangeHalfOpen(anchor);
  return new Date(endExclusive.getTime() - 1);
}

export function getUtcDayRangeInclusive(anchor: Date = new Date()) {
  const y = anchor.getUTCFullYear();
  const m = anchor.getUTCMonth();
  const d = anchor.getUTCDate();
  return {
    start: new Date(Date.UTC(y, m, d, 0, 0, 0, 0)),
    end: new Date(Date.UTC(y, m, d, 23, 59, 59, 999)),
  };
}

/** YYYY-MM-DD in the UTC calendar for `anchor` (for AI / logs). */
export function utcCalendarDateString(anchor: Date = new Date()): string {
  const y = anchor.getUTCFullYear();
  const m = String(anchor.getUTCMonth() + 1).padStart(2, "0");
  const day = String(anchor.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Persisted transaction `date`: calendar-only ISO dates → UTC midnight on that day;
 * full ISO strings parse as usual. Empty → now.
 */
export function parseTransactionDateForStorage(iso?: string | null): Date {
  if (iso == null || String(iso).trim() === "") return new Date();
  const s = String(iso).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(`${s}T00:00:00.000Z`);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Display a stored transaction `date` using the UTC calendar (matches YYYY-MM-DD saves).
 * `locale` should be a BCP 47 tag (e.g. from `navigator.language` on the client).
 */
export function formatUtcCalendarDate(
  input: Date | string,
  locale = "en",
  opts?: { withYear?: boolean },
): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const withYear = opts?.withYear !== false;
  return d.toLocaleDateString(locale, {
    timeZone: "UTC",
    year: withYear ? "numeric" : undefined,
    month: "short",
    day: "numeric",
  });
}

/** Long form for AI system prompt (UTC calendar). */
export function formatUtcCalendarDateLong(
  input: Date,
  locale = "en",
): string {
  return input.toLocaleDateString(locale, {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** `week-YYYY-MM-DD` / `month-YYYY-MM` keys from AI coach insights (UTC calendar). */
export function formatInsightPeriodKey(periodKey: string, locale = "en"): string {
  if (periodKey.startsWith("week-")) {
    const iso = periodKey.slice("week-".length);
    const d = new Date(`${iso}T00:00:00.000Z`);
    if (Number.isNaN(d.getTime())) return periodKey;
    const inner = d.toLocaleDateString(locale, {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `Week of ${inner}`;
  }
  if (periodKey.startsWith("month-")) {
    const ym = periodKey.slice("month-".length);
    const [yStr, moStr] = ym.split("-");
    const y = Number(yStr);
    const mo = Number(moStr);
    if (!y || !mo) return periodKey;
    const d = new Date(Date.UTC(y, mo - 1, 1));
    return d.toLocaleDateString(locale, {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    });
  }
  return periodKey;
}

/** Weekday name for a calendar date string stored as UTC midnight (e.g. recurring weekly anchor). */
export function formatUtcWeekdayLong(isoDateOnly: string, locale = "en"): string {
  const d = parseTransactionDateForStorage(isoDateOnly);
  return d.toLocaleDateString(locale, { timeZone: "UTC", weekday: "long" });
}
