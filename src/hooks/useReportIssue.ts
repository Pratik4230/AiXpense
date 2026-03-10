import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ReportIssuePayload {
  title: string;
  description: string;
  type: "bug" | "feature" | "other";
  mediaUrls: string[];
  mediaFileIds: string[];
}

export function useReportIssue() {
  return useMutation({
    mutationFn: (payload: ReportIssuePayload) =>
      api.post("/issues", payload).then((r) => r.data),
  });
}
