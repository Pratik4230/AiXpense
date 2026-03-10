import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LogsViewer } from "@/components/admin/LogsViewer";
import { ScrollText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Logs | Admin | AiXpense",
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export default async function AdminLogsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.email !== ADMIN_EMAIL) {
    redirect("/aixpense");
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="size-5" />
            <h1 className="text-2xl font-bold">Logs</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Application logs — 10 day retention, errors highlighted
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline" size="sm">
            Back to Admin
          </Button>
        </Link>
      </div>

      <LogsViewer />
    </div>
  );
}
