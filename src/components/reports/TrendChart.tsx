"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useChartColors } from "@/hooks/useChartColors";
import type { TrendPoint, ReportRange, ReportMode } from "@/services/reports";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatLabel(point: TrendPoint, range: ReportRange): string {
  if (range === "1m") {
    return `${point._id.day} ${MONTH_NAMES[(point._id.month ?? 1) - 1]}`;
  }
  return MONTH_NAMES[(point._id.month ?? 1) - 1];
}

interface Props {
  data?: TrendPoint[];
  isLoading: boolean;
  range: ReportRange;
  mode: ReportMode;
}

export function TrendChart({ data, isLoading, range, mode }: Props) {
  const c = useChartColors();

  const chartData = (data ?? []).map((p) => ({
    label: formatLabel(p, range),
    amount: p.total,
  }));

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          {mode === "expense" ? "Spending Trend" : "Income Trend"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-52 w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">
            No data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                }
              />
              <Tooltip
                formatter={(v: number | undefined) =>
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(v ?? 0)
                }
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: `1px solid ${c.border}`,
                  background: c.card,
                  color: c.foreground,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                cursor={{ fill: c.muted }}
              />
              <Bar
                dataKey="amount"
                fill={c.primary}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
