"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useChartColors } from "@/hooks/useChartColors";
import type { CategoryPoint } from "@/services/reports";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#facc15",
  "#10b981",
  "#e879f9",
  "#f97316",
  "#22d3ee",
  "#ec4899",
  "#84cc16",
  "#6366f1",
  "#fb923c",
  "#14b8a6",
  "#e11d48",
  "#7c3aed",
  "#0ea5e9",
  "#d946ef",
  "#16a34a",
  "#c2410c",
  "#a78bfa",
  "#059669",
  "#f59e0b",
  "#0284c7",
  "#be185d",
  "#65a30d",
];

interface Props {
  data?: CategoryPoint[];
  isLoading: boolean;
}

export function CategoryChart({ data, isLoading }: Props) {
  const c = useChartColors();

  const total = (data ?? []).reduce((s, item) => s + item.total, 0);

  const chartData = (data ?? []).slice(0, 8).map((item, i) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.total,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Category Breakdown
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
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              />
              <Tooltip
                formatter={(
                  v: number | undefined,
                  name: string | undefined,
                ) => [
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(v ?? 0) +
                    ` (${total > 0 ? (((v ?? 0) / total) * 100).toFixed(1) : 0}%)`,
                  name ?? "",
                ]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: `1px solid ${c.border}`,
                  background: c.card,
                  color: c.foreground,
                  padding: "8px 12px",
                }}
                itemStyle={{ color: c.foreground }}
                labelStyle={{ color: c.foreground }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: c.foreground }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
