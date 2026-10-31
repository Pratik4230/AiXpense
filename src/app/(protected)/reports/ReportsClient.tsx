"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownToLine, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OverviewCards,
  TrendChart,
  CategoryChart,
  BudgetVsActual,
  TopExpenses,
  CoachInsightCard,
} from "@/components/reports";
import { useReports, type ReportRange, type ReportMode } from "@/services/reports";

const RANGES: { label: string; value: ReportRange }[] = [
  { label: "This Month", value: "1m" },
  { label: "3 Months", value: "3m" },
  { label: "6 Months", value: "6m" },
  { label: "This Year", value: "1y" },
];

const MODES: { label: string; value: ReportMode }[] = [
  { label: "Expenses", value: "expense" },
  { label: "Income", value: "income" },
];

export function ReportsClient({ isPremium }: { isPremium: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const range = (searchParams.get("range") as ReportRange) ?? "1m";
  const mode = (searchParams.get("mode") as ReportMode) ?? "expense";

  function updateParam(key: string, value: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.replace(`/reports?${params.toString()}`, { scroll: false });
    });
  }

  const { data, isLoading } = useReports(range, mode);

  function downloadExport() {
    window.location.href = `/api/reports/export?range=${range}&mode=${mode}`;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-5 sm:py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/aixpense">
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Reports</h1>
            <p className="text-sm text-muted-foreground">
              {mode === "expense" ? "Spending" : "Income"} insights and
              analytics
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <div className="overflow-x-auto">
            <div className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-muted/50 p-1">
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => updateParam("range", r.value)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 ${
                    range === r.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={downloadExport}>
            <ArrowDownToLine className="mr-2 size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => updateParam("mode", m.value)}
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
              mode === m.value
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <OverviewCards
          data={data?.overview}
          isLoading={isLoading}
          mode={mode}
        />

        <CoachInsightCard isPremium={isPremium} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendChart
            data={data?.trend}
            isLoading={isLoading}
            range={range}
            mode={mode}
          />
          <CategoryChart data={data?.categories} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopExpenses data={data?.topExpenses} isLoading={isLoading} mode={mode} />
          {mode === "expense" && (
            <BudgetVsActual data={data?.budgetVsActual ?? undefined} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
