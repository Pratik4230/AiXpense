"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Send } from "lucide-react";

async function readJsonSafe<T>(res: Response): Promise<T | null> {
  const raw = await res.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function sendBroadcast(data: { subject: string; body: string }) {
  const res = await fetch("/api/admin/broadcast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await readJsonSafe<{ error?: string }>(res);
    throw new Error(err?.error || "Failed to send broadcast email");
  }
  return (await readJsonSafe<{ success: boolean }>(res)) ?? { success: true };
}

async function sendTargeted(data: {
  subject: string;
  body: string;
  emails: string[];
}) {
  const res = await fetch("/api/admin/targeted", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await readJsonSafe<{ error?: string }>(res);
    throw new Error(err?.error || "Failed to send targeted email");
  }
  return (
    (await readJsonSafe<{ success: boolean; totalRecipients: number }>(res)) ?? {
      success: true,
      totalRecipients: data.emails.length,
    }
  );
}

function parseEmails(input: string) {
  return Array.from(
    new Set(
      input
        .split(/[\n,]/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

export function BroadcastEmail() {
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [targetedSubject, setTargetedSubject] = useState("");
  const [targetedBody, setTargetedBody] = useState("");
  const [targetedEmails, setTargetedEmails] = useState("");

  const broadcastMutation = useMutation({
    mutationFn: sendBroadcast,
    onSuccess: () => {
      toast.success("Broadcast queued. Emails sending in background.");
      setBroadcastSubject("");
      setBroadcastBody("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const targetedMutation = useMutation({
    mutationFn: sendTargeted,
    onSuccess: (data: { totalRecipients: number }) => {
      toast.success(`Targeted email queued for ${data.totalRecipients} recipients.`);
      setTargetedSubject("");
      setTargetedBody("");
      setTargetedEmails("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) return;
    broadcastMutation.mutate({ subject: broadcastSubject, body: broadcastBody });
  };

  const handleTargetedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = parseEmails(targetedEmails);
    if (!targetedSubject.trim() || !targetedBody.trim() || emails.length === 0) return;
    targetedMutation.mutate({
      subject: targetedSubject,
      body: targetedBody,
      emails,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="size-4 text-amber-600" />
            Broadcast Email
          </CardTitle>
          <CardDescription>
            Send an email to all verified users. Delivered asynchronously via
            Inngest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="broadcast-subject">Subject</Label>
              <Input
                id="broadcast-subject"
                placeholder="What's new in AiXpense..."
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
                disabled={broadcastMutation.isPending || targetedMutation.isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="broadcast-body">Message</Label>
              <Textarea
                id="broadcast-body"
                placeholder="Write your message here. Use new lines for paragraphs."
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                disabled={broadcastMutation.isPending || targetedMutation.isPending}
                rows={6}
                className="resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={
                broadcastMutation.isPending ||
                targetedMutation.isPending ||
                !broadcastSubject.trim() ||
                !broadcastBody.trim()
              }
              className="w-full"
            >
              {broadcastMutation.isPending ? "Queuing..." : "Send to All Users"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="size-4 text-emerald-600" />
            Targeted Email
          </CardTitle>
          <CardDescription>
            Send to selected recipients only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTargetedSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="targeted-subject">Subject</Label>
              <Input
                id="targeted-subject"
                placeholder="Important update for selected users..."
                value={targetedSubject}
                onChange={(e) => setTargetedSubject(e.target.value)}
                disabled={broadcastMutation.isPending || targetedMutation.isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targeted-body">Message</Label>
              <Textarea
                id="targeted-body"
                placeholder="Write your message here. Use new lines for paragraphs."
                value={targetedBody}
                onChange={(e) => setTargetedBody(e.target.value)}
                disabled={broadcastMutation.isPending || targetedMutation.isPending}
                rows={6}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targeted-emails">Recipient emails</Label>
              <Textarea
                id="targeted-emails"
                placeholder="one@email.com, two@email.com"
                value={targetedEmails}
                onChange={(e) => setTargetedEmails(e.target.value)}
                disabled={broadcastMutation.isPending || targetedMutation.isPending}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Separate emails with commas or new lines.
              </p>
            </div>
            <Button
              type="submit"
              disabled={
                broadcastMutation.isPending ||
                targetedMutation.isPending ||
                !targetedSubject.trim() ||
                !targetedBody.trim() ||
                parseEmails(targetedEmails).length === 0
              }
              className="w-full"
            >
              {targetedMutation.isPending
                ? "Queuing..."
                : "Send to Selected Emails"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
