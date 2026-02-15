"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success">("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("success");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 pb-6 text-center space-y-4">
            <Loader2 className="size-12 animate-spin text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Processing Payment...</h2>
            <p className="text-muted-foreground text-sm">
              Please wait while we activate your premium subscription.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 pb-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="size-12 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-muted-foreground">
              Your premium subscription has been activated. You now have
              unlimited access to all premium features.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push("/aixpense")}
            >
              Start Using Premium <ArrowRight className="size-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/profile")}
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
