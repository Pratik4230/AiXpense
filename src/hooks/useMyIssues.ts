import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MyIssueItem {
  id: string;
  title: string;
  description: string;
  type: "bug" | "feature" | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  mediaUrls: string[];
  adminNote: string;
  createdAt: string;
}

interface MyIssuesResponse {
  issues: MyIssueItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useMyIssues(page = 1) {
  return useQuery<MyIssuesResponse>({
    queryKey: ["my-issues", page],
    queryFn: () =>
      api
        .get<MyIssuesResponse>("/issues", { params: { page } })
        .then((r) => r.data),
  });
}
