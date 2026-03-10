import { connectDB } from "@/lib/db";
import { Issue } from "@/models";

export interface IssueItem {
  id: string;
  title: string;
  description: string;
  type: "bug" | "feature" | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  mediaUrls: string[];
  adminNote: string;
  userEmail: string;
  createdAt: string;
}

export async function getAdminIssues(
  filter: Record<string, unknown> = {},
  page = 1,
  pageSize = 10,
) {
  await connectDB();

  const [total, issues] = await Promise.all([
    Issue.countDocuments(filter),
    Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
  ]);

  return {
    issues: issues.map((i) => ({
      id: String(i._id),
      title: i.title,
      description: i.description,
      type: i.type,
      status: i.status,
      mediaUrls: i.mediaUrls ?? [],
      adminNote: i.adminNote ?? "",
      userEmail: i.userEmail ?? "unknown",
      createdAt: (i.createdAt as Date).toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
