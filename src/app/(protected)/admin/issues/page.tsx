import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { IssuesList } from "@/components/admin/IssuesList";
import { Bug } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Issues | Admin | AiXpense",
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export default async function AdminIssuesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.email !== ADMIN_EMAIL) {
    redirect("/aixpense");
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bug className="size-5" />
            <h1 className="text-2xl font-bold">Issues</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            All user-reported bugs and feature requests
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline" size="sm">
            Back to Admin
          </Button>
        </Link>
      </div>

      <IssuesList />
    </div>
  );
}
