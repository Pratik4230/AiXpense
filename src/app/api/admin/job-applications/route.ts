import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { JobApplication, JOB_APPLICATION_STATUSES } from "@/models";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.email === ADMIN_EMAIL;
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "all";
  const roleId = searchParams.get("roleId") ?? "all";
  const search = searchParams.get("search")?.trim();
  const filter: Record<string, unknown> = {};

  if (status !== "all" && JOB_APPLICATION_STATUSES.includes(status as never)) filter.status = status;
  if (roleId !== "all") filter.roleId = roleId;
  if (search) filter.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];

  await connectDB();
  const applications = await JobApplication.find(filter).sort({ createdAt: -1 }).limit(100).lean();

  return Response.json({
    applications: applications.map((application) => ({
      ...application,
      id: String(application._id),
      _id: undefined,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    })),
  });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  const adminNotes = typeof body.adminNotes === "string" ? body.adminNotes.trim().slice(0, 2000) : undefined;
  if (!id || !JOB_APPLICATION_STATUSES.includes(status as never)) return Response.json({ error: "Invalid application update" }, { status: 400 });

  const timestampField: Record<string, string> = {
    viewed: "viewedAt",
    selected: "selectedAt",
    joined: "joinedAt",
    rejected: "rejectedAt",
  };
  const update: Record<string, unknown> = { status };
  if (adminNotes !== undefined) update.adminNotes = adminNotes;
  const timestamp = timestampField[status];
  if (timestamp) update[timestamp] = new Date();

  await connectDB();
  const application = await JobApplication.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!application) return Response.json({ error: "Application not found" }, { status: 404 });
  return Response.json({ success: true });
}
