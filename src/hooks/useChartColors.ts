"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

function resolveCssVar(name: string): string {
  const el = document.documentElement;
  return getComputedStyle(el).getPropertyValue(name).trim();
}

export interface ChartColors {
  card: string;
  foreground: string;
  muted: string;
  border: string;
  primary: string;
}

const DEFAULT: ChartColors = {
  card: "#ffffff",
  foreground: "#0f172a",
  muted: "#f1f5f9",
  border: "#e2e8f0",
  primary: "#f97316",
};

export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    if (typeof window === "undefined") return DEFAULT;
    return {
      card: resolveCssVar("--card") || DEFAULT.card,
      foreground: resolveCssVar("--foreground") || DEFAULT.foreground,
      muted: resolveCssVar("--muted") || DEFAULT.muted,
      border: resolveCssVar("--border") || DEFAULT.border,
      primary: resolveCssVar("--primary") || DEFAULT.primary,
    };
  }, [resolvedTheme]);
}
