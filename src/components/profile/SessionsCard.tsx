"use client";

import { useState, useTransition } from "react";
import { Monitor, Smartphone, Globe, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

interface Session {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  isCurrent: boolean;
}

interface SessionsCardProps {
  sessions: Session[];
  currentSessionId: string;
}

function parseUserAgent(ua: string | null) {
  if (!ua) return { device: "Unknown Device", os: "", browser: "" };

  const isMobile = /mobile|android|iphone|ipad/i.test(ua);

  let browser = "Browser";
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";

  let os = "";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return {
    device: isMobile ? "Mobile" : "Desktop",
    browser,
    os,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function SessionsCard({ sessions: initialSessions }: SessionsCardProps) {
  const [sessions, setSessions] = useState(initialSessions);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRevoke(sessionId: string) {
    setRevokingId(sessionId);
    startTransition(async () => {
      const { error } = await authClient.revokeSession({ token: sessionId });
      if (error) {
        toast.error("Failed to revoke session");
      } else {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success("Session revoked");
      }
      setRevokingId(null);
    });
  }

  const currentSession = sessions.find((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Active Sessions</CardTitle>
        <CardDescription>
          Devices currently signed in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentSession && (
          <SessionRow
            session={currentSession}
            onRevoke={handleRevoke}
            isRevoking={revokingId === currentSession.id}
            isPending={isPending}
          />
        )}

        {otherSessions.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground pt-1">Other sessions</p>
            {otherSessions.map((s) => (
              <SessionRow
                key={s.id}
                session={s}
                onRevoke={handleRevoke}
                isRevoking={revokingId === s.id}
                isPending={isPending}
              />
            ))}
          </>
        )}

        {sessions.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">
            No active sessions
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SessionRow({
  session,
  onRevoke,
  isRevoking,
  isPending,
}: {
  session: Session;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
  isPending: boolean;
}) {
  const { device, browser, os } = parseUserAgent(session.userAgent);
  const isMobile = device === "Mobile";

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-muted-foreground shrink-0">
          {isMobile ? (
            <Smartphone className="size-4" />
          ) : (
            <Monitor className="size-4" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">
              {browser} on {os || device}
            </span>
            {session.isCurrent && (
              <Badge variant="secondary" className="text-xs shrink-0">
                This device
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {session.ipAddress && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="size-3" />
                {session.ipAddress}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(session.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {!session.isCurrent && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => onRevoke(session.id)}
          disabled={isPending}
        >
          {isRevoking ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </Button>
      )}
    </div>
  );
}
