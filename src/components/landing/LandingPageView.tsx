import type { ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Globe2,
  Mail,
  MessageSquare,
  PieChart,
  Repeat2,
  ScanLine,
  Shield,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";

import { SmartLink, SmartTextLink } from "@/components/auth/SmartLink";
import { AndroidBetaDialog } from "@/components/landing/AndroidBetaDialog";
import { LandingChatDemo } from "@/components/landing/LandingChatDemo";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingJsonLd } from "@/components/landing/LandingJsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CURRENCIES } from "@/constants/currency";

const freeFeatures = [
  "7 AI messages per day",
  "Voice input in 22+ Indian languages",
  "Expense & income tracking",
  "Search & filter transactions",
] as const;

const premiumFeatures = [
  "Everything in Free",
  "Unlimited AI conversations",
  "Spending insights, charts & breakdowns",
  "AI bill & receipt scanning",
  "Recurring payment rules in the app",
  "Priority support",
] as const;

export function LandingPageView() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      <LandingJsonLd />

      <header className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Sparkles className="size-5 text-primary" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            AiXpense
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <AndroidBetaDialog
            triggerLabel="Android Closed Beta"
            triggerVariant="outline"
            triggerClassName="rounded-full hidden sm:inline-flex border-border/80 bg-background hover:bg-muted gap-2.5 px-4"
          />
          <SmartTextLink className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Login
          </SmartTextLink>
          <SmartLink className="rounded-full px-6">Get Started</SmartLink>
        </div>
      </header>

      <main className="container mx-auto px-4 relative z-10">
        <section className="py-14 sm:py-20 lg:py-28 text-center max-w-5xl mx-auto flex flex-col items-center">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary cursor-default"
          >
            <Zap className="size-3.5 mr-2 fill-primary" />
            <span>AI assistant for expenses &amp; income</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.15]">
            Stop losing track <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
              of where your money went
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Just say{" "}
            <span className="text-foreground font-medium">
              &quot;Zomato 450&quot;
            </span>{" "}
            or{" "}
            <span className="text-foreground font-medium">
              &quot;petrol 800 aaj&quot;
            </span>
            - AiXpense logs the amount, category, and date automatically. Works
            in Hindi, Marathi, Hinglish, and 22+ Indian languages. No forms. No
            spreadsheet. Ever.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-center justify-center">
            <SmartLink
              size="lg"
              className="h-12 px-8 rounded-full text-base sm:text-lg w-full sm:w-auto"
            >
              Start free no card needed
              <ArrowRight className="ml-2 size-5" />
            </SmartLink>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full text-base sm:text-lg border-border/80 bg-background hover:bg-muted w-full sm:w-auto"
              asChild
            >
              <a href="#chat-demo">
                Watch it work
                <ArrowRight className="ml-2 size-5" />
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center max-w-md mt-5 leading-relaxed">
            Log spending the way you already text one plain sentence at a time.
          </p>
        </section>

        <LandingChatDemo />

        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Three steps from &quot;I should track this&quot; to a clean
              ledger.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 sm:grid-cols-3 max-w-6xl mx-auto">
            <div className="relative flex flex-col items-start p-6 sm:p-8 rounded-2xl border border-border/50 bg-card">
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 sm:mb-6 text-primary font-bold text-xl">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Say or type what happened
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Examples:{" "}
                <span className="text-foreground font-medium">
                  &quot;Zomato dinner 450&quot;
                </span>
                ,{" "}
                <span className="text-foreground font-medium">
                  &quot;petrol 800 today&quot;
                </span>
                . No rigid fields just a sentence.
              </p>
            </div>

            <div className="relative flex flex-col items-start p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 sm:mb-6 text-orange-400 font-bold text-xl">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                AI structures it for you
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Amount, merchant, category, tags, and date are inferred
                automatically including income like{" "}
                <span className="text-foreground font-medium">
                  &quot;received salary 50000&quot;
                </span>
                .
              </p>
            </div>

            <div className="relative flex flex-col items-start p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="size-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 sm:mb-6 text-green-400 font-bold text-xl">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                See your money clearly
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Search and filter anytime, set budgets with alerts, and on
                Premium get coaching and report cards so patterns are obvious
                not buried in a sheet.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              One workspace for voice, chat, budgets, and insights without
              building your own system in Notes or Sheets.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon={<MessageSquare className="size-6 text-blue-500" />}
              title="Speak it, done"
              description="Hindi, Marathi, Hinglish, English, and 22+ Indian languages typed or spoken. One line is enough."
              color="bg-blue-500/10"
              footer={
                <a
                  href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7437362498141593600/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Watch voice demo
                  <ExternalLink className="size-3.5" />
                </a>
              }
            />
            <FeatureCard
              icon={<ScanLine className="size-6 text-amber-500" />}
              title="Snap a bill, skip the typing"
              description="AI reads totals and line items from a receipt photo in chat you confirm and save in seconds (Premium)."
              color="bg-amber-500/10"
              badge="Premium"
              footer={
                <SmartLink
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 w-full sm:w-auto"
                >
                  Try AiXpense free
                  <ArrowRight className="size-3.5" />
                </SmartLink>
              }
            />
            <FeatureCard
              icon={<PieChart className="size-6 text-violet-500" />}
              title="Budgets that warn you early"
              description="Categories and trends surface before overspend becomes a surprise."
              color="bg-violet-500/10"
            />
            <FeatureCard
              icon={<Repeat2 className="size-6 text-orange-500" />}
              title="Recurring on autopilot"
              description="Rent, subscriptions, EMIs Premium rules drop routine spends into your ledger on schedule."
              color="bg-orange-500/10"
            />
            <FeatureCard
              icon={<Mail className="size-6 text-sky-500" />}
              title="Know where your money actually goes"
              description="Premium turns your history into weekly nudges and monthly patterns not a wall of numbers."
              color="bg-sky-500/10"
            />
            <FeatureCard
              icon={<Shield className="size-6 text-green-500" />}
              title="Your data stays yours"
              description="We don't sell your financial data. Delete your account and data whenever you want."
              color="bg-green-500/10"
            />
          </div>
        </section>

        <section
          id="premium"
          className="py-16 sm:py-20 relative rounded-3xl border border-primary/20 bg-primary/5 px-4 sm:px-8 mb-8"
        >
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge
              variant="outline"
              className="border-primary/30 bg-background/80 text-primary"
            >
              <Sparkles className="size-3.5 mr-1.5" />
              Premium
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Ready to go unlimited?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              The free tier gets you started. Premium gets you there faster
              unlimited AI conversations, receipt scanning, recurring
              automation, shareable report cards, and priority support.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="rounded-full shadow-lg shadow-primary/20"
                asChild
              >
                <Link href="/premium">View Premium &amp; pricing</Link>
              </Button>
              <SmartLink variant="outline" className="rounded-full">
                Try free first
              </SmartLink>
            </div>
          </div>
        </section>

        <section
          id="supported-currencies"
          aria-labelledby="supported-currencies-heading"
          className="py-14 sm:py-20 relative max-w-6xl mx-auto w-full min-w-0 overflow-x-hidden"
        >
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <Globe2 className="size-6 text-primary" />
            </div>
            <h2
              id="supported-currencies-heading"
              className="text-2xl sm:text-3xl font-bold mb-3"
            >
              Supported account currencies
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-2 leading-relaxed">
              Pick one as your ledger currency amounts, budgets, and reports all
              use it. Change anytime in{" "}
              <strong className="text-foreground font-medium">Profile</strong>{" "}
              after sign-up. INR is the default for India.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/60 p-4 sm:p-6 w-full min-w-0 overflow-x-hidden">
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 text-center sm:text-left">
              {CURRENCIES.length} ISO codes (flag · code · symbol · name)
            </p>
            <div
              className="rounded-xl border border-border/40 bg-muted/20 p-3 sm:p-4 w-full min-w-0"
              role="region"
              aria-label="Full list of supported account currency codes"
            >
              <ul className="grid w-full min-w-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 list-none p-0 m-0">
                {CURRENCIES.map((c) => (
                  <li key={c.code} className="min-w-0">
                    <span className="flex min-w-0 w-full items-start gap-2 rounded-lg border border-border/50 bg-background/80 px-2 py-2 text-xs sm:text-sm">
                      <span
                        className="text-base shrink-0 leading-none pt-0.5"
                        aria-hidden
                      >
                        {c.flag}
                      </span>
                      <span className="min-w-0 flex-1 flex flex-col items-start gap-0.5 leading-tight text-left">
                        <span className="font-semibold tabular-nums">
                          {c.code}
                        </span>
                        <span className="text-[0.65rem] sm:text-xs text-muted-foreground wrap-anywhere">
                          {c.symbol} · {c.name}
                        </span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Simple pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Start free with 7 AI messages per day. Upgrade on the web when you
              want unlimited help and scanning.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto items-stretch">
            <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 space-y-4 flex flex-col">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Free
                </p>
                <p className="text-4xl font-bold">₹0</p>
                <p className="text-sm text-muted-foreground mt-1">
                  7 AI messages / day
                </p>
              </div>
              <ul className="space-y-3 text-sm flex-1">
                {freeFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="space-y-2 pt-1">
                <SmartLink variant="outline" className="w-full rounded-full">
                  Get started free
                </SmartLink>
                <p className="text-xs text-center text-muted-foreground">
                  No credit card required.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/50 bg-linear-to-b from-primary/10 to-background p-6 sm:p-8 space-y-6 relative flex flex-col shadow-lg shadow-primary/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Monthly
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Premium
                </p>
                <div className="flex items-end gap-1">
                  <p className="text-4xl font-bold">₹499</p>
                  <p className="text-muted-foreground mb-1">/month</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Billed monthly · cancel anytime
                </p>
              </div>
              <ul className="space-y-3 text-sm flex-1">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full rounded-full shadow-lg shadow-primary/20"
                asChild
              >
                <Link href="/premium">Buy Premium monthly</Link>
              </Button>
            </div>

            <div className="rounded-2xl border-2 border-amber-500/40 bg-linear-to-b from-amber-500/10 to-background p-6 sm:p-8 space-y-6 relative flex flex-col shadow-lg shadow-amber-500/10 sm:col-span-2 lg:col-span-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Best value
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Premium yearly
                </p>
                <div className="flex items-end gap-1 flex-wrap">
                  <p className="text-4xl font-bold">₹3,999</p>
                  <p className="text-muted-foreground mb-1">/year</p>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                  Save ~33% vs paying monthly
                </p>
              </div>
              <ul className="space-y-3 text-sm flex-1">
                {premiumFeatures.map((f) => (
                  <li key={`y-${f}`} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full rounded-full bg-amber-500 hover:bg-amber-500/90 text-white border-0 shadow-lg shadow-amber-500/20"
                asChild
              >
                <Link href="/premium">Buy Premium yearly</Link>
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
            Secure checkout via Razorpay or Dodo by region. See{" "}
            <Link href="/refund" className="text-primary hover:underline">
              billing &amp; cancellation
            </Link>{" "}
            for renewals and terms.
          </p>
        </section>

        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Straight answers before you sign up.
            </p>
          </div>
          <LandingFaq />
        </section>

        <section className="py-16 sm:py-24 text-center">
          <div className="max-w-4xl mx-auto p-6 sm:p-12 rounded-3xl border border-border bg-linear-to-b from-muted/50 to-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Your next expense is happening today.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto">
              Take 30 seconds to log it no credit card needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                Voice &amp; text in one chat
              </div>
              <span className="hidden sm:inline text-border">|</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                AI-organized ledger
              </div>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <SmartLink
                size="lg"
                className="h-12 px-8 sm:px-10 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Open the app
              </SmartLink>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-12"
                asChild
              >
                <Link href="/premium">Compare Premium</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <p className="text-center text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Account currency: change anytime in{" "}
            <strong className="text-foreground font-medium">Profile</strong>.
            Full code list:{" "}
            <a
              href="#supported-currencies"
              className="text-primary font-medium hover:underline"
            >
              supported currencies
            </a>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refund"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Billing &amp; cancellation
            </Link>
            <Link
              href="/shipping"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Shipping Policy
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 AiXpense. Built with &hearts; and AI.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="https://www.linkedin.com/in/pratikjadhav1438/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </Link>
              <Link
                href="https://x.com/Pratik4230"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter/X
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  badge,
  footer,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  badge?: string;
  footer?: ReactNode;
}) {
  return (
    <Card className="bg-card h-full flex flex-col">
      <CardHeader className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div
            className={`size-12 rounded-xl ${color} flex items-center justify-center`}
          >
            {icon}
          </div>
          {badge ? (
            <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full shrink-0">
              {badge}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-xl pt-2">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed mt-2 flex-1">
          {description}
        </CardDescription>
        {footer ? <div className="mt-4 pt-1">{footer}</div> : null}
      </CardHeader>
    </Card>
  );
}
