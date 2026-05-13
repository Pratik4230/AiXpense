"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUtcCalendarDate } from "@/lib/utcDates";

/**
 * Formats expense/transaction dates on the UTC calendar using the browser locale.
 */
export function useUtcCalendarDateFormat() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.language) {
      setLocale(navigator.language);
    }
  }, []);

  return useMemo(
    () => ({
      locale,
      formatTransactionDate: (input: Date | string, withYear = true) =>
        formatUtcCalendarDate(input, locale, { withYear }),
    }),
    [locale],
  );
}
