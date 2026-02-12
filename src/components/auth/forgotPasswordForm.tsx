"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError(error.message || "Something went wrong");
      setIsLoading(false);
      return;
    }

    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="size-12 text-green-500 mx-auto" />
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-muted-foreground text-sm">
            If an account exists for{" "}
            <span className="font-medium">{email}</span>, we&apos;ve sent a
            password reset link.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="size-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-3" />
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
