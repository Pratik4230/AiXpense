"use client";

import { useState } from "react";
import { Bug, Lightbulb, HelpCircle, Calendar, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyIssues, type MyIssueItem } from "@/hooks/useMyIssues";

const TYPE_ICON = { bug: Bug, feature: Lightbulb, other: HelpCircle };

const TYPE_VARIANT: Record<string, "destructive" | "secondary" | "outline"> = {
  bug: "destructive",
  feature: "secondary",
  other: "outline",
};

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  open: "destructive",
  in_progress: "secondary",
  resolved: "default",
  closed: "outline",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

function MyIssueCard({ issue }: { issue: MyIssueItem }) {
  const TypeIcon = TYPE_ICON[issue.type];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <TypeIcon className="size-4 shrink-0 text-muted-foreground" />
            <h3 className="font-semibold text-sm leading-tight truncate">
              {issue.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={TYPE_VARIANT[issue.type]} className="capitalize text-xs">
              {issue.type}
            </Badge>
            <Badge variant={STATUS_VARIANT[issue.status]} className="text-xs">
              {STATUS_LABELS[issue.status]}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Calendar className="size-3" />
          {new Date(issue.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-3">
          {issue.description}
        </p>
        {issue.adminNote && (
          <div className="flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <MessageSquare className="size-3 mt-0.5 shrink-0" />
            <span>{issue.adminNote}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="pb-2 space-y-2">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-3 w-32" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

export function MyIssues() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyIssues(page);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${data?.total ?? 0} reported`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !data?.issues.length ? (
        <p className="text-sm text-muted-foreground text-center py-10">
          You haven&apos;t reported any issues yet.
        </p>
      ) : (
        <div className="space-y-3">
          {data.issues.map((issue) => (
            <MyIssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Page {data.page} of {data.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-xs tabular-nums w-16 text-center">
              {data.page} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.totalPages || isLoading}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
