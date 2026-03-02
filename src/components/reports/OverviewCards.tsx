import {
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
  Tag,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { OverviewData, ReportMode } from "@/services/reports";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  data?: OverviewData;
  isLoading: boolean;
  mode: ReportMode;
}

export function OverviewCards({ data, isLoading, mode }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const change = data?.change ?? 0;
  const isExpense = mode === "expense";

  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;

  const trendColor = isExpense
    ? change > 0
      ? "text-red-500"
      : change < 0
        ? "text-emerald-500"
        : "text-muted-foreground"
    : change > 0
      ? "text-emerald-500"
      : change < 0
        ? "text-red-500"
        : "text-muted-foreground";

  const cards = [
    {
      label: isExpense ? "Total Spent" : "Total Earned",
      value: fmt(data?.total ?? 0),
      icon: Wallet,
      sub: (
        <span className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="size-3" />
          {Math.abs(change)}% vs last period
        </span>
      ),
    },
    {
      label: "Transactions",
      value: data?.count ?? 0,
      icon: Zap,
      sub: <span className="text-xs text-muted-foreground">this period</span>,
    },
    {
      label: isExpense ? "Top Category" : "Top Source",
      value: data?.topCategory
        ? data.topCategory.charAt(0).toUpperCase() + data.topCategory.slice(1)
        : "—",
      icon: Tag,
      sub: (
        <span className="text-xs text-muted-foreground">
          {fmt(data?.topCategoryAmount ?? 0)}
        </span>
      ),
    },
    {
      label: isExpense ? "Largest Expense" : "Largest Income",
      value: fmt(data?.largestExpense ?? 0),
      icon: TrendingUp,
      sub: (
        <span className="text-xs text-muted-foreground">
          single transaction
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/60">
          <CardContent className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <c.icon className="size-3.5 sm:size-4 text-muted-foreground shrink-0" />
            </div>
            <p className="text-base sm:text-xl font-bold tracking-tight truncate">
              {c.value}
            </p>
            {c.sub}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
