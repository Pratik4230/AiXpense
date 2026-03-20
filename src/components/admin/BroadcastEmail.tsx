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

async function sendBroadcast(data: { subject: string; body: string }) {
  const res = await fetch("/api/admin/broadcast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to send");
  }
  return res.json();
}

export function BroadcastEmail() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: sendBroadcast,
    onSuccess: () => {
      toast.success("Broadcast queued. Emails sending in background.");
      setSubject("");
      setBody("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    mutation.mutate({ subject, body });
  };

  return (
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
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="broadcast-body">Message</Label>
            <Textarea
              id="broadcast-body"
              placeholder="Write your message here. Use new lines for paragraphs."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={mutation.isPending}
              rows={6}
              className="resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={mutation.isPending || !subject.trim() || !body.trim()}
            className="w-full"
          >
            {mutation.isPending ? "Queuing..." : "Send to All Users"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
