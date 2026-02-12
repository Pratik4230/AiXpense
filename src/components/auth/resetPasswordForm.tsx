"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const urlError = searchParams.get("error");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!token || urlError === "INVALID_TOKEN") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertTriangle className="size-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Invalid or expired link</h2>
          <p className="text-muted-foreground text-sm">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link href="/forgot-password">
            <Button className="mt-4">Request new link</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="size-12 text-green-500 mx-auto" />
          <h2 className="text-xl font-semibold">Password reset successful</h2>
          <p className="text-muted-foreground text-sm">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
          <Link href="/login">
            <Button className="mt-4">Go to login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError(error.message || "Failed to reset password");
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
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
