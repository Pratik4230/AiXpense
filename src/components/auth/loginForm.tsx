"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, authClient } from "@/lib/authClient";
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
import { OAuthButtons } from "./oauthButtons";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";

const MAX_RESEND_ATTEMPTS = 3;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setNeedsVerification(false);

    const { error } = await signIn.email(
      { email, password, callbackURL: "/aixpense" },
      {
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            setNeedsVerification(true);
          }
        },
      },
    );

    if (error) {
      if (!needsVerification) {
        setError(error.message || "Invalid credentials");
      }
      setIsLoading(false);
      return;
    }

    router.push("/aixpense");
  };

  const handleResend = async () => {
    if (resendCount >= MAX_RESEND_ATTEMPTS) return;
    setResendLoading(true);
    setResendSuccess(false);

    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/aixpense",
    });

    setResendCount((prev) => prev + 1);
    setResendSuccess(true);
    setResendLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your AiXpense account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons disabled={isLoading} />
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            continue with email
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && !needsVerification && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {needsVerification && (
            <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Mail className="size-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email not verified</p>
                  <p className="text-xs text-muted-foreground">
                    Please check your inbox for a verification link before
                    signing in.
                  </p>
                </div>
              </div>
              {resendSuccess && (
                <p className="text-xs text-green-600">
                  Verification email sent!
                </p>
              )}
              {resendCount < MAX_RESEND_ATTEMPTS ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleResend}
                  disabled={resendLoading}
                >
                  {resendLoading
                    ? "Sending..."
                    : `Resend verification email (${MAX_RESEND_ATTEMPTS - resendCount} left)`}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  Maximum resend attempts reached. Please check your spam folder
                  or try again later.
                </p>
              )}
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
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
