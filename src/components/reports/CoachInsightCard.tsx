"use client";

import { Lock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLatestInsight } from "@/services/insights";
import Link from "next/link";
import { useCurrency } from "@/hooks/useCurrency";


function getPeriodLabel(periodKey: string) {
  if (periodKey.startsWith("week-")) {
    const date = new Date(periodKey.replace("week-", ""));
    return `Week of ${date.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`;
  }
  if (periodKey.startsWith("month-")) {
    const [year, month] = periodKey.replace("month-", "").split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }
  return periodKey;
}

function cleanInsightText(text: string) {
  return text
    .replace(/\s*--\s*/g, " ")
    .replace(/\s*—\s*/g, " ")
    .trim();
}

interface CoachInsightCardProps {
  isPremium: boolean;
}

export function CoachInsightCard({ isPremium }: CoachInsightCardProps) {
  const { data: insight, isLoading } = useLatestInsight(isPremium);
  const { format } = useCurrency();

  if (!isPremium) {
    return (
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            AI Coach Insight
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-2 select-none">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-4/6" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-3/4" />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background flex flex-col items-center justify-end pb-4 gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Lock className="size-3.5" />
              Premium feature
            </div>
            <Link href="/premium">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                Upgrade to unlock
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  if (!insight) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            AI Coach Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your first insight will arrive after your weekly or monthly summary is generated. Keep logging!
          </p>
        </CardContent>
      </Card>
    );
  }

  const period = getPeriodLabel(insight.periodKey);

  return (
    <Card className="border-amber-500/20 bg-linear-to-br from-amber-950/10 to-background overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500" />
          AI Coach Insight
        </CardTitle>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold tracking-tight">{format(insight.totalSpent)}</span>
          <span className="text-xs text-muted-foreground">{period}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/80">{cleanInsightText(insight.content)}</p>
      </CardContent>
    </Card>
  );
}
