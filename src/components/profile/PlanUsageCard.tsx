"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Crown, Sparkles, Loader2, ExternalLink } from "lucide-react";
import {
  cancelSubscription,
  getDodoBillingPortalUrl,
} from "@/actions/subscription";
import { useUtcCalendarDateFormat } from "@/hooks/useUtcCalendarDateFormat";
import { FREE_LIFETIME_LIMIT } from "@/constants/trials";

interface Subscription {
  status: string;
  plan: string;
  billingProvider?: "razorpay" | "dodo";
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
}

interface PlanUsageCardProps {
  isPremium: boolean;
  freeTrials: number;
  subscription: Subscription | null;
}

export function PlanUsageCard({
  isPremium,
  freeTrials,
  subscription,
}: PlanUsageCardProps) {
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const { locale } = useUtcCalendarDateFormat();

  const openBillingPortal = async () => {
    setPortalLoading(true);
    const result = await getDodoBillingPortalUrl();
    setPortalLoading(false);
    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    if ("url" in result && result.url) {
      window.location.href = result.url;
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    const result = await cancelSubscription();
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(
        "Subscription cancelled. You'll retain access until the end of the billing period.",
      );
    }
  };

  const periodEndDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Plan & Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Plan</span>
          <Badge
            variant={isPremium ? "default" : "secondary"}
            className="gap-1"
          >
            {isPremium ? (
              <>
                <Crown className="size-3" />
                Premium
              </>
            ) : (
              "Free"
            )}
          </Badge>
        </div>

        {isPremium && subscription && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Billing cycle</span>
              <span className="font-medium capitalize">
                {subscription.plan}
              </span>
            </div>

            {subscription.cancelAtPeriodEnd ? (
              <div className="rounded-md bg-muted/50 border border-border px-3 py-2 text-sm text-muted-foreground">
                Subscription cancelled. Premium access until{" "}
                <span className="font-medium text-foreground">
                  {periodEndDate}
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Renews on</span>
                  <span className="font-medium">{periodEndDate}</span>
                </div>
                {subscription.billingProvider === "dodo" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={openBillingPortal}
                    disabled={portalLoading}
                  >
                    {portalLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ExternalLink className="size-4" />
                    )}
                    Billing portal (cancel or update card)
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                      >
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will keep premium access until{" "}
                          <strong>{periodEndDate}</strong>. After that, your
                          account reverts to the free plan. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancel}
                          disabled={loading}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Yes, cancel"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </>
        )}

        {!isPremium && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Free messages remaining
              </span>
              <span className="text-sm font-medium">{freeTrials}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{
                  width: `${(freeTrials / FREE_LIFETIME_LIMIT) * 100}%`,
                }}
              />
            </div>
            <Link href="/premium">
              <Button className="w-full gap-2" variant="outline">
                <Sparkles className="size-4" />
                Upgrade to Premium
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
