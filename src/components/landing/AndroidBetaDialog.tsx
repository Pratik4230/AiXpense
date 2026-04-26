"use client";

import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address").max(254),
});

type AndroidBetaDialogProps = {
  triggerClassName?: string;
  triggerLabel?: string;
  size?: "default" | "lg";
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
};

export function AndroidBetaDialog({
  triggerClassName,
  triggerLabel = "Get Android App",
  size = "default",
  triggerVariant = "outline",
}: AndroidBetaDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const parsed = emailSchema.safeParse({ email: email.trim() });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/android-beta-optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      setEmail("");
      toast.success("Thanks! We will email you shortly for closed beta.");
    } catch {
      toast.error("Could not submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError("");
      setEmail("");
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size={size}
          variant={triggerVariant}
          className={triggerClassName}
        >
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-border/70 dark:bg-zinc-100">
            <Image
              src="/gp.png"
              alt="Google Play"
              width={24}
              height={24}
              className="size-6 rounded-sm"
              unoptimized
              loading="eager"
              priority
            />
          </span>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="size-5 text-foreground" />
            AiXpense Android Closed Beta
          </DialogTitle>
          <DialogDescription>
            AiXpense Android is in closed beta right now. If you want to try it,
            share your email and we will invite you shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          Public version will go live between <strong>5-10 May</strong>.
        </div>

        {isSubmitted ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-300">
            Success! We will email you shortly for the closed beta program.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email for Android closed beta"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Join Closed Beta"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
