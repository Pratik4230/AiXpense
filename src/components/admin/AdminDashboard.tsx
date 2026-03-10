"use client";

import { AdminStats } from "@/lib/admin/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DollarSign, Zap, Hash, TrendingUp, Bug, ScrollText } from "lucide-react";
import Link from "next/link";

interface Props {
  stats: AdminStats;
}

function fmt(usd: number) {
  return `$${usd.toFixed(4)}`;
}

function fmtTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function AdminDashboard({ stats }: Props) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All costs are in USD based on OpenAI pricing
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Cost"
          value={fmt(stats.totalCostUsd)}
          iconColor="text-green-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Today"
          value={fmt(stats.todayCostUsd)}
          iconColor="text-blue-500"
        />
        <StatCard
          icon={Hash}
          label="Total Requests"
          value={stats.totalRequests.toLocaleString()}
          iconColor="text-purple-500"
        />
        <StatCard
          icon={Zap}
          label="Total Tokens"
          value={fmtTokens(stats.totalTokens)}
          iconColor="text-amber-500"
        />
        <Link href="/admin/issues" className="block">
          <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Bug className="size-4 text-rose-500" />
                <span className="text-xs text-muted-foreground">Issues</span>
              </div>
              <p className="text-xl font-bold font-mono">View All</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/logs" className="block">
          <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <ScrollText className="size-4 text-sky-500" />
                <span className="text-xs text-muted-foreground">Logs</span>
              </div>
              <p className="text-xl font-bold font-mono">View All</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Cost (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.daily.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={stats.daily}
                margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v.toFixed(3)}`}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [`$${Number(v).toFixed(4)}`, "Cost"]}
                  labelFormatter={(l) => `Date: ${l}`}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="cost"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage by User</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stats.byUser.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-8 text-center">
              No data yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                  <TableHead className="text-right">Tokens</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.byUser.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell className="font-mono text-xs">
                      {u.userEmail}
                    </TableCell>
                    <TableCell className="text-right">{u.requests}</TableCell>
                    <TableCell className="text-right">
                      {fmtTokens(u.totalTokens)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {fmt(u.totalCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`size-4 ${iconColor}`} />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="text-xl font-bold font-mono">{value}</p>
      </CardContent>
    </Card>
  );
}
