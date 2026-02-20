import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/admin/stats";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin | AiXpense",
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.email !== ADMIN_EMAIL) {
    redirect("/aixpense");
  }

  const stats = await getAdminStats();

  return <AdminDashboard stats={stats} />;
}
