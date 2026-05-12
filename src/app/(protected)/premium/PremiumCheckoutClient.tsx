"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createSubscription } from "@/lib/api";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Zap,
  Crown,
  Star,
  Sparkles,
  TrendingUp,
  Download,
  PieChart,
  Loader2,
  Globe,
  AlertCircle,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    text: "Unlimited AI Conversations",
    desc: "No daily limits. Ask as much as you need.",
  },
  {
    icon: TrendingUp,
    text: "Smart Spending Insights",
    desc: "AI analyzes your patterns to save money.",
  },
  {
    icon: PieChart,
    text: "Advanced Visualizations",
    desc: "Interactive charts for income & expenses.",
  },
  {
    icon: Download,
    text: "Export Tax-Ready Reports",
    desc: "Download simplified CSV & PDF summaries.",
  },
];

export function PremiumCheckoutClient({
  useInternationalCheckout,
  internationalBillingUnavailable,
  country,
}: {
  useInternationalCheckout: boolean;
  internationalBillingUnavailable: boolean;
  country: string;
}) {
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);

  const handleRazorpayUpgrade = async (plan: "monthly" | "yearly") => {
    try {
      setLoading(plan);
      const data = await createSubscription(plan);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        toast.error(
          axiosError.response?.data?.error || "Failed to create subscription",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Subscription error:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleDodoCheckout = async (plan: "monthly" | "yearly") => {
    try {
      setLoading(plan);
      const slug =
        plan === "monthly" ? "premium-monthly-intl" : "premium-yearly-intl";
      const { data, error } =
        await authClient.dodopayments.checkoutSession({
          slug,
        });
      if (error) {
        toast.error(
          typeof error.message === "string"
            ? error.message
            : "Checkout failed",
        );
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("No checkout URL returned");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleUpgrade = useInternationalCheckout
    ? handleDodoCheckout
    : handleRazorpayUpgrade;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-background z-[-1]" />
      <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-125 h-125 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] z-[-1]" />

      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <Badge
            variant="outline"
            className="px-4 py-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 backdrop-blur-sm shadow-sm"
          >
            <Crown className="size-3.5 mr-2 animate-pulse" />
            Premium Access
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
            Invest in Your Financial Clarity
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Unlock the full potential of AiXpense with unlimited AI
            interactions, deep insights, and premium security.
          </p>
          {internationalBillingUnavailable ? (
            <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center justify-center gap-2 max-w-xl mx-auto">
              <AlertCircle className="size-4 shrink-0" />
              International checkout is not configured yet (missing Dodo env
              or webhook). Your profile country is{" "}
              <span className="font-medium">{country}</span>. Contact support or
              set country to IN for Rupee billing.
            </p>
          ) : null}
          {useInternationalCheckout ? (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Globe className="size-4 shrink-0" />
              International checkout — pricing in your local currency at
              checkout (country: {country})
            </p>
          ) : null}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          <Card className="relative flex flex-col overflow-hidden border-border/50 shadow-lg bg-background hover:border-primary/20 transition-all duration-300">
            <CardHeader className="text-center pb-2 pt-8">
              <CardTitle className="text-xl font-medium text-muted-foreground">
                Monthly
              </CardTitle>
              <div className="flex items-baseline justify-center gap-1 mt-4">
                {useInternationalCheckout ? (
                  <span className="text-2xl font-bold tracking-tight">
                    Premium Monthly
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight">
                      ₹499
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">
                      /month
                    </span>
                  </>
                )}
              </div>
              <CardDescription className="pt-2">
                {useInternationalCheckout
                  ? "Billed every month. Cancel anytime from the billing portal."
                  : "Flexible. Cancel anytime."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6 flex-1">
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 text-base font-semibold border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
                onClick={() => handleUpgrade("monthly")}
                disabled={
                  loading !== null || internationalBillingUnavailable
                }
              >
                {loading === "monthly" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Choose Monthly"
                )}
              </Button>

              <div className="space-y-4 pt-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary shrink-0">
                      <feature.icon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">
                        {feature.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-center border-t bg-muted/20 p-6 mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="size-3.5" />
                <span>
                  {useInternationalCheckout
                    ? "Secure checkout via Dodo Payments"
                    : "Secure Payments"}
                </span>
              </div>
            </CardFooter>
          </Card>

          <Card className="relative flex flex-col overflow-hidden border-amber-500/30 shadow-2xl bg-linear-to-b from-background to-amber-500/5 z-10 hover:shadow-amber-500/10 transition-all duration-300 ring-1 ring-amber-500/20">
            <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-500" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-linear-to-r from-amber-500 to-yellow-600 text-white border-none shadow-lg shadow-amber-500/20">
                <Star className="size-3 mr-1 fill-current" />
                Best Value
              </Badge>
            </div>

            <CardHeader className="text-center pb-2 pt-8">
              <CardTitle className="text-xl font-medium text-amber-600 dark:text-amber-400">
                Yearly
              </CardTitle>
              <div className="flex items-baseline justify-center gap-1 mt-4">
                {useInternationalCheckout ? (
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    Premium Yearly
                  </span>
                ) : (
                  <>
                    <span className="text-5xl font-bold tracking-tight text-foreground">
                      ₹3,999
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">
                      /year
                    </span>
                  </>
                )}
              </div>
              <CardDescription
                className={
                  useInternationalCheckout
                    ? "pt-2 text-muted-foreground"
                    : "pt-2 text-green-600 dark:text-green-400 font-medium bg-green-500/10 inline-block px-3 py-1 rounded-full text-xs mx-auto"
                }
              >
                {useInternationalCheckout
                  ? "Best rate when you pay annually. Renews each year until you cancel."
                  : "Save 33% (4 months free)"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6 flex-1">
              <Button
                size="lg"
                className="w-full gap-2 text-base font-semibold bg-linear-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg shadow-amber-500/25 border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleUpgrade("yearly")}
                disabled={
                  loading !== null || internationalBillingUnavailable
                }
              >
                {loading === "yearly" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start Premium Year <Zap className="size-4 fill-current" />
                  </>
                )}
              </Button>

              <div className="space-y-4 pt-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-0.5 p-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <feature.icon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">
                        {feature.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-center gap-4 border-t border-amber-500/10 bg-amber-500/5 p-6 mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="size-3.5 text-amber-600/70" />
                <span>
                  {useInternationalCheckout
                    ? "Secure checkout via Dodo Payments"
                    : "Secure Payments"}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center space-y-2 pt-8 border-t border-border/40 max-w-2xl mx-auto">
          <p className="text-sm text-foreground/80 font-medium">
            Join thousands of users mastering their finance.
          </p>
          <p className="text-xs text-muted-foreground">
            100% Secure. Cancel anytime from your account settings. No questions
            asked.
          </p>
        </div>
      </div>
    </div>
  );
}
