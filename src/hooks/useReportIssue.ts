import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ReportIssuePayload {
  title: string;
  description: string;
  type: "bug" | "feature" | "other";
  mediaUrls: string[];
}

export function useReportIssue() {
  return useMutation({
    mutationFn: (payload: ReportIssuePayload) =>
      axios.post("/api/issues", payload).then((r) => r.data),
  });
}
