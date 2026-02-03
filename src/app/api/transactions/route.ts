import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Expense } from "@/lib/models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const searchParams = req.nextUrl.searchParams;

  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const period = searchParams.get("period") || "month";

  await connectDB();

  const query: Record<string, unknown> = { userId };

  if (type && type !== "all") {
    query.type = type;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0);
  }

  if (period !== "all") {
    query.date = { $gte: startDate };
  }

  const transactions = await Expense.find(query)
    .sort({ date: -1 })
    .limit(100)
    .lean();

  return Response.json({
    success: true,
    count: transactions.length,
    transactions,
  });
}
