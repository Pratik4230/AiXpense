"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { TopExpense, ReportMode } from "@/services/reports";
import { useCurrency } from "@/hooks/useCurrency";
import { useUtcCalendarDateFormat } from "@/hooks/useUtcCalendarDateFormat";


interface Props {
  data?: TopExpense[];
  isLoading: boolean;
  mode: ReportMode;
}

export function TopExpenses({ data, isLoading, mode }: Props) {
  const { format, code: profileCurrency } = useCurrency();
  const { formatTransactionDate } = useUtcCalendarDateFormat();
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">
          {mode === "expense" ? "Top Expenses" : "Top Income"}
        </CardTitle>
        <Link
          href={`/transactions?mode=${mode}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No {mode === "expense" ? "expenses" : "income"} this period
          </p>
        ) : (
          <div className="space-y-2">
            {data.map((e, i) => (
              <div
                key={e._id}
                className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-muted-foreground w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{e.item}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant="secondary"
                        className="text-xs py-0 px-1.5 capitalize"
                      >
                        {e.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTransactionDate(e.date, false)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold shrink-0 ml-2">
                  {format(e.amount, e.currency ?? profileCurrency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
