"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/lib/api";
import { IssueItem } from "@/lib/admin/issues";
import { useUtcCalendarDateFormat } from "@/hooks/useUtcCalendarDateFormat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bug,
  Lightbulb,
  HelpCircle,
  Video,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MessageSquare,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface IssuesResponse {
  issues: IssueItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

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

const ALL_STATUSES = ["all", "open", "in_progress", "resolved", "closed"];
const ALL_TYPES = ["all", "bug", "feature", "other"];

function MediaPreview({ urls }: { urls: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  if (!urls.length) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-3">
        {urls.map((url) => {
          const isVideo = /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
          return (
            <button
              key={url}
              type="button"
              onClick={() => setLightbox(url)}
              className="relative w-16 h-16 rounded-md overflow-hidden border border-border bg-muted shrink-0 hover:opacity-80 transition-opacity"
            >
              {isVideo ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Video className="size-6" />
                </div>
              ) : (
                <Image
                  src={url}
                  alt="attachment"
                  fill
                  className="object-cover"
                />
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">Media Preview</DialogTitle>
          {lightbox &&
            (/\.(mp4|webm|mov|avi)(\?|$)/i.test(lightbox) ? (
              <video
                src={lightbox}
                controls
                className="w-full rounded-md max-h-[80vh]"
              />
            ) : (
              <div className="relative w-full aspect-video">
                <Image
                  src={lightbox}
                  alt="preview"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AdminNoteEditor({
  issueId,
  initialNote,
}: {
  issueId: string;
  initialNote: string;
}) {
  const qc = useQueryClient();
  const [note, setNote] = useState(initialNote);
  const [expanded, setExpanded] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (adminNote: string) =>
      api.patch(`/admin/issues/${issueId}`, { adminNote }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-issues"] });
      toast.success("Note saved");
      setExpanded(false);
    },
    onError: () => toast.error("Failed to save note"),
  });

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-3"
      >
        <MessageSquare className="size-3" />
        {note ? "Edit admin note" : "Add admin note"}
        {note && (
          <span className="text-xs text-foreground/70 truncate max-w-48">
            : {note}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Internal note (not visible to user)..."
        className="text-xs min-h-16 resize-none"
        maxLength={2000}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => mutate(note)}
          disabled={isPending}
        >
          <Check className="size-3" />
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs"
          onClick={() => {
            setNote(initialNote);
            setExpanded(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function DeleteIssueButton({ issueId }: { issueId: string }) {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.delete(`/admin/issues/${issueId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-issues"] });
      toast.success("Issue deleted");
      setConfirm(false);
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-destructive"
        onClick={() => setConfirm(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete issue?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function IssueCard({ issue }: { issue: IssueItem }) {
  const { locale } = useUtcCalendarDateFormat();
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (status: string) =>
      api.patch(`/admin/issues/${issue.id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-issues"] }),
  });

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
            <Badge
              variant={TYPE_VARIANT[issue.type]}
              className="capitalize text-xs"
            >
              {issue.type}
            </Badge>
            <Select
              value={issue.status}
              onValueChange={(v) => mutate(v)}
              disabled={isPending}
            >
              <SelectTrigger className="h-7 text-xs w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([v, label]) => (
                  <SelectItem key={v} value={v} className="text-xs">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DeleteIssueButton issueId={issue.id} />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <User className="size-3" />
            {issue.userEmail}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(issue.createdAt).toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Badge variant={STATUS_VARIANT[issue.status]} className="text-xs">
            {STATUS_LABELS[issue.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {issue.description}
        </p>
        <MediaPreview urls={issue.mediaUrls} />
        <AdminNoteEditor
          issueId={issue.id}
          initialNote={issue.adminNote ?? ""}
        />
      </CardContent>
    </Card>
  );
}

function IssueCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2 space-y-2">
        <div className="flex justify-between gap-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  );
}

export function IssuesList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const { data, isLoading } = useQuery<IssuesResponse>({
    queryKey: ["admin-issues", page, status, type],
    queryFn: async () => {
      const res = await api.get<IssuesResponse>("/admin/issues", {
        params: { page, status, type },
      });
      return res.data;
    },
  });

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${data?.total ?? 0} total issues`}
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  resetPage();
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  status === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s === "all" ? "All" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v);
              resetPage();
            }}
          >
            <SelectTrigger className="h-7 text-xs w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="text-xs capitalize">
                  {t === "all" ? "All types" : t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <IssueCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.issues.length ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No issues found
        </p>
      ) : (
        <div className="space-y-3">
          {data.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
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
