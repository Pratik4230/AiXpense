"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertTriangle className="size-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Verification failed</h2>
          <p className="text-muted-foreground text-sm">
            This verification link is invalid or has expired. Please sign in and
            request a new verification email.
          </p>
          <Link href="/login">
            <Button className="mt-4">Go to login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 text-center space-y-4">
        <CheckCircle2 className="size-12 text-green-500 mx-auto" />
        <h2 className="text-xl font-semibold">Email verified</h2>
        <p className="text-muted-foreground text-sm">
          Your email has been verified successfully. You can now sign in to your
          account.
        </p>
        <Link href="/login">
          <Button className="mt-4">Sign in</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
