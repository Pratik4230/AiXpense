"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Info, AlertTriangle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface LogEntry {
  id: string;
  level: "info" | "warn" | "error";
  event: string;
  userId: string | null;
  data: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
}

interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const LEVEL_CONFIG = {
  info: { label: "Info", icon: Info, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  warn: { label: "Warn", icon: AlertTriangle, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  error: { label: "Error", icon: AlertCircle, className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

const LOG_EVENTS = [
  "all",
  "chat_complete",
  "chat_quota_exceeded",
  "chat_unauthorized",
  "ai_usage_record_fail",
  "inngest_coach_complete",
  "inngest_cleanup_complete",
  "razorpay_webhook",
  "razorpay_webhook_fail",
  "razorpay_sub_created",
  "razorpay_sub_create_fail",
  "razorpay_sub_cancelled",
  "razorpay_sub_cancel_fail",
  "issue_created",
  "issue_notify_email_failed",
  "imagekit_delete_failed",
  "email_fail",
  "search_specialist_fail",
  "search_query_fail",
  "tool_save_expense_fail",
  "tool_save_income_fail",
  "tool_delete_fail",
  "tool_update_fail",
  "voice_sarvam_fail",
];

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function LogLevelBadge({ level }: { level: "info" | "warn" | "error" }) {
  const cfg = LEVEL_CONFIG[level];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-mono ${cfg.className}`}>
      <Icon className="size-3" />
      {cfg.label}
    </Badge>
  );
}

function DataCell({ data, error }: { data: Record<string, unknown> | null; error: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!data && !error) return <span className="text-muted-foreground text-xs">—</span>;

  const preview = error
    ? error.slice(0, 80)
    : Object.entries(data ?? {})
        .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join(", ")
        .slice(0, 80);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="text-left w-full"
    >
      {expanded ? (
        <pre className="text-xs bg-muted rounded p-2 whitespace-pre-wrap break-all max-w-xs">
          {error && <span className="text-red-400 block mb-1">{error}</span>}
          {data && JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <span className="text-xs text-muted-foreground font-mono truncate block max-w-xs">
          {preview}{(preview.length >= 80) && "…"}
        </span>
      )}
    </button>
  );
}

export function LogsViewer() {
  const [page, setPage] = useState(1);
  const [level, setLevel] = useState("all");
  const [event, setEvent] = useState("all");
  const [userId, setUserId] = useState("");
  const [userIdInput, setUserIdInput] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery<LogsResponse>({
    queryKey: ["admin-logs", page, level, event, userId],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (level !== "all") params.set("level", level);
      if (event !== "all") params.set("event", event);
      if (userId) params.set("userId", userId);
      const res = await fetch(`/api/admin/logs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
    refetchInterval: 30000,
  });

  function applyFilters() {
    setUserId(userIdInput);
    setPage(1);
  }

  function resetFilters() {
    setLevel("all");
    setEvent("all");
    setUserId("");
    setUserIdInput("");
    setPage(1);
  }

  const errorCount = data?.logs.filter((l) => l.level === "error").length ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Application Logs</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            id="logs-refresh-btn"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Select value={level} onValueChange={(v) => { setLevel(v); setPage(1); }}>
            <SelectTrigger className="w-28 h-8 text-xs" id="logs-level-filter">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warn</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={event} onValueChange={(v) => { setEvent(v); setPage(1); }}>
            <SelectTrigger className="w-52 h-8 text-xs" id="logs-event-filter">
              <SelectValue placeholder="Event" />
            </SelectTrigger>
            <SelectContent>
              {LOG_EVENTS.map((e) => (
                <SelectItem key={e} value={e}>{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <Input
              placeholder="Filter by userId"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="h-8 text-xs w-44 font-mono"
              id="logs-userid-input"
            />
            <Button size="sm" variant="secondary" className="h-8" onClick={applyFilters}>
              Apply
            </Button>
          </div>

          {(level !== "all" || event !== "all" || userId) && (
            <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={resetFilters}>
              Clear
            </Button>
          )}
        </div>

        {errorCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-red-500 mt-1">
            <AlertCircle className="size-3" />
            {errorCount} error{errorCount !== 1 ? "s" : ""} on this page
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : !data || data.logs.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">No logs found</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Level</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="hidden md:table-cell">User</TableHead>
                  <TableHead>Data / Error</TableHead>
                  <TableHead className="text-right w-24">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className={log.level === "error" ? "bg-red-500/5" : ""}
                  >
                    <TableCell>
                      <LogLevelBadge level={log.level} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.event}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                      {log.userId ? log.userId.slice(-8) : "—"}
                    </TableCell>
                    <TableCell>
                      <DataCell data={log.data} error={log.error} />
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(log.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
              <span>{data.total.toLocaleString()} total</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  id="logs-prev-btn"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span>
                  {page} / {data.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  id="logs-next-btn"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
