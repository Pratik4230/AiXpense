import { connectDB } from "@/lib/db";
import { AiUsage } from "@/models";

export interface DailyUsage {
  date: string;
  cost: number;
  requests: number;
}

export interface UserUsage {
  userId: string;
  userEmail: string;
  totalCost: number;
  totalTokens: number;
  requests: number;
}

export interface AdminStats {
  totalCostUsd: number;
  todayCostUsd: number;
  totalRequests: number;
  totalTokens: number;
  daily: DailyUsage[];
  byUser: UserUsage[];
}

export async function getAdminStats(): Promise<AdminStats> {
  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totals, todayTotals, daily, byUser] = await Promise.all([
    AiUsage.aggregate([
      {
        $group: {
          _id: null,
          totalCostUsd: { $sum: "$costUsd" },
          totalTokens: { $sum: "$totalTokens" },
          totalRequests: { $sum: 1 },
        },
      },
    ]),
    AiUsage.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      },
      {
        $group: {
          _id: null,
          costUsd: { $sum: "$costUsd" },
        },
      },
    ]),
    AiUsage.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          cost: { $sum: "$costUsd" },
          requests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    AiUsage.aggregate([
      {
        $group: {
          _id: "$userId",
          userEmail: { $first: "$userEmail" },
          totalCost: { $sum: "$costUsd" },
          totalTokens: { $sum: "$totalTokens" },
          requests: { $sum: 1 },
        },
      },
      { $sort: { totalCost: -1 } },
    ]),
  ]);

  return {
    totalCostUsd: totals[0]?.totalCostUsd ?? 0,
    todayCostUsd: todayTotals[0]?.costUsd ?? 0,
    totalRequests: totals[0]?.totalRequests ?? 0,
    totalTokens: totals[0]?.totalTokens ?? 0,
    daily: daily.map((d) => ({
      date: d._id,
      cost: d.cost,
      requests: d.requests,
    })),
    byUser: byUser.map((u) => ({
      userId: u._id,
      userEmail: u.userEmail,
      totalCost: u.totalCost,
      totalTokens: u.totalTokens,
      requests: u.requests,
    })),
  };
}
