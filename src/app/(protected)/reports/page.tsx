"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OverviewCards,
  TrendChart,
  CategoryChart,
  BudgetVsActual,
  TopExpenses,
  CoachInsightCard,
} from "@/components/reports";
import {
  useReportOverview,
  useReportTrend,
  useReportCategories,
  useReportBudgetVsActual,
  useReportTopExpenses,
  type ReportRange,
  type ReportMode,
} from "@/services/reports";

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

export default function ReportsPage() {
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

  const { data: overview, isLoading: overviewLoading } = useReportOverview(
    range,
    mode,
  );
  const { data: trend, isLoading: trendLoading } = useReportTrend(range, mode);
  const { data: categories, isLoading: catLoading } = useReportCategories(
    range,
    mode,
  );
  const { data: budgetVsActual, isLoading: bvaLoading } =
    useReportBudgetVsActual(range);
  const { data: topExpenses, isLoading: topLoading } = useReportTopExpenses(
    range,
    mode,
  );

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

        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 whitespace-nowrap">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => updateParam("range", r.value)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  range === r.value
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
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
          data={overview}
          isLoading={overviewLoading}
          mode={mode}
        />

        <CoachInsightCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrendChart
            data={trend}
            isLoading={trendLoading}
            range={range}
            mode={mode}
          />
          <CategoryChart data={categories} isLoading={catLoading} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopExpenses data={topExpenses} isLoading={topLoading} mode={mode} />
          {mode === "expense" && (
            <BudgetVsActual data={budgetVsActual} isLoading={bvaLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
