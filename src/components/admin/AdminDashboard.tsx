"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bug, ScrollText } from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/admin/issues" className="block">
          <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Bug className="size-4 text-rose-500" />
                <span className="text-xs text-muted-foreground">Issues</span>
              </div>
              <p className="text-xl font-bold font-mono">View All</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/logs" className="block">
          <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <ScrollText className="size-4 text-sky-500" />
                <span className="text-xs text-muted-foreground">Logs</span>
              </div>
              <p className="text-xl font-bold font-mono">View All</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
