import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BudgetVsActualPoint } from "@/services/reports";
import { useCurrency } from "@/hooks/useCurrency";



interface Props {
  data?: BudgetVsActualPoint[];
  isLoading: boolean;
}

export function BudgetVsActual({ data, isLoading }: Props) {
  const { format } = useCurrency();
  if (isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Budget vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Budget vs Actual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const pct = item.budget > 0 ? (item.spent / item.budget) * 100 : 0;
          const color =
            pct >= 100
              ? "bg-red-500"
              : pct >= 80
                ? "bg-amber-500"
                : "bg-emerald-500";
          const textColor =
            pct >= 100
              ? "text-red-500"
              : pct >= 80
                ? "text-amber-500"
                : "text-emerald-500";

          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium capitalize">{item.category}</span>
                <span className={`text-xs font-semibold ${textColor}`}>
                  {format(item.spent)} / {format(item.budget)}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {pct.toFixed(1)}% used
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
