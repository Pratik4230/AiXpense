import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { JobApplicationsList } from "@/components/admin/JobApplicationsList";

export const metadata: Metadata = { title: "Job Applications | AiXpense Admin" };
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export default async function JobApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.email !== ADMIN_EMAIL) redirect("/aixpense");
  return <JobApplicationsList />;
}
