"use client";

import { useState } from "react";
import { Bug, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MyIssues } from "@/components/report-issue/MyIssues";
import { ReportIssueDialog } from "@/components/report-issue/ReportIssueDialog";

export function MyReportsCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">My Reports</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ReportIssueDialog>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                <Flag className="size-3" />
                New Report
              </Button>
            </ReportIssueDialog>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <MyIssues />
        </CardContent>
      )}
    </Card>
  );
}
