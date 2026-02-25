"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bug, Lightbulb, HelpCircle, Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUploader } from "./MediaUploader";
import { useReportIssue } from "@/hooks/useReportIssue";
import { useAppForm } from "./form-context";

type IssueType = "bug" | "feature" | "other";

const issueTypes: {
  value: IssueType;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "other", label: "Other", icon: HelpCircle },
];

interface ReportIssueDialogProps {
  children?: React.ReactNode;
}

export function ReportIssueDialog({ children }: ReportIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useReportIssue();

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      type: "bug" as IssueType,
      mediaUrls: [] as string[],
    },
    onSubmit: ({ value }) => {
      mutate(value, {
        onSuccess: () => {
          toast.success("Issue reported. We'll look into it soon.");
          form.reset();
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to report issue. Please try again.");
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
          >
            <Flag className="size-4" />
            Report Issue
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <form.Subscribe selector={(s) => s.values.type}>
            {(type) => {
              const found = issueTypes.find((t) => t.value === type);
              const TypeIcon = found?.icon ?? Bug;
              return (
                <DialogTitle className="flex items-center gap-2">
                  <TypeIcon className="size-5" />
                  {found?.label ?? "Feedback"}
                </DialogTitle>
              );
            }}
          </form.Subscribe>
          <DialogDescription className="sr-only">
            Submit a bug report, feature request, or other feedback.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 mt-2"
        >
          <form.Field name="type">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="issue-type">Type</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as IssueType)}
                >
                  <SelectTrigger id="issue-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <Icon className="size-4" />
                          {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "Title is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="issue-title">Title</Label>
                <Input
                  id="issue-title"
                  placeholder="Brief summary of the issue"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) =>
                !value.trim() ? "Description is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="issue-description">Description</Label>
                <Textarea
                  id="issue-description"
                  placeholder="Describe the issue in detail. what happened, what you expected, steps to reproduce..."
                  className="min-h-30 resize-none"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="mediaUrls">
            {(field) => (
              <div className="space-y-1.5">
                <Label>
                  Attachments{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional, up to 5)
                  </span>
                </Label>
                <MediaUploader
                  value={field.state.value}
                  onChange={(urls) => field.handleChange(urls)}
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
