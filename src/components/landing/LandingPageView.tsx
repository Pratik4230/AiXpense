import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  Camera,
  CheckCircle2,
  ExternalLink,
  Mail,
  MessageSquare,
  Mic2,
  PieChart,
  Repeat2,
  ScanLine,
  Shield,
  Smartphone,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";

import { SmartLink, SmartTextLink } from "@/components/auth/SmartLink";
import { AndroidBetaDialog } from "@/components/landing/AndroidBetaDialog";
import { BLOG_HIGHLIGHTS } from "@/components/landing/data";
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
        <section className="py-14 sm:py-24 lg:py-32 text-center max-w-5xl mx-auto flex flex-col items-center">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary cursor-default"
          >
            <Zap className="size-3.5 mr-2 fill-primary" />
            <span>AI-powered expense tracking for India</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.15]">
            The expense tracker that <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
              listens, reads, and learns
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            AiXpense is an AI assistant for your money: say{" "}
            <span className="text-foreground font-medium">
              &quot;Lunch 250&quot;
            </span>
            , speak in English, Hindi, Marathi, or 22+ Indian languages, or scan a bill.
            It extracts amount, category, tags, and date no tedious forms, just
            a conversation-style log that stays organised.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 max-w-2xl">
            {[
              "Built for Indian languages & Hinglish",
              "Budgets, search & recurring rules",
              "Premium: unlimited AI + receipt scan",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs sm:text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-3.5 sm:size-4 text-primary mr-1.5 shrink-0" />
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <SmartLink
              size="lg"
              className="h-12 px-8 rounded-full text-base sm:text-lg"
            >
              Start tracking free
              <ArrowRight className="ml-2 size-5" />
            </SmartLink>
            <AndroidBetaDialog
              size="lg"
              triggerLabel="Get it on Android"
              triggerVariant="outline"
              triggerClassName="h-12 px-8 rounded-full text-base sm:text-lg border-border/80 bg-background hover:bg-muted gap-2.5"
            />
          </div>
          <div className="mt-4 flex flex-col items-center gap-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs sm:text-sm text-muted-foreground">
              <Smartphone className="size-3.5 sm:size-4 text-primary" />
              Android closed beta: 20-day streak (3 chats/day) = 3 months
              premium (mobile only)
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
              Streaks count only in the Android app. Join the beta with your
              email above, then install from Play when you receive the invite.
            </p>
          </div>

          <div className="mt-14 sm:mt-20 w-full sm:max-w-3xl mx-auto">
            <div className="rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
              <div className="border-b border-border/50 px-4 py-3 flex items-center gap-2 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 text-xs font-medium text-muted-foreground/70">
                  AiXpense Assistant
                </div>
              </div>
              <div className="p-3 sm:p-6 space-y-6 text-left">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md">
                    <p className="text-sm sm:text-base">
                      Ordered Pizza for team lunch 1200rs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4 max-w-[95%] sm:max-w-[90%]">
                  <div className="size-7 sm:size-8 rounded-full bg-linear-to-br from-primary to-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles className="size-3.5 sm:size-4 text-white" />
                  </div>
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="bg-muted border border-border/50 px-3 py-3 sm:px-4 sm:py-4 rounded-2xl rounded-tl-sm">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Expense added successfully!
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-sm">
                        <div className="text-muted-foreground">Item</div>
                        <div className="font-medium">Pizza</div>

                        <div className="text-muted-foreground">Amount</div>
                        <div className="font-medium">₹1,200.00</div>

                        <div className="text-muted-foreground">Category</div>
                        <div className="font-medium text-amber-400">
                          Food &amp; Dining
                        </div>

                        <div className="text-muted-foreground">Tags</div>
                        <div className="font-medium text-xs flex flex-wrap gap-1">
                          <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            #team
                          </span>
                          <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            #lunch
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Everything you need to stay on top of spending
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              One chat-first workspace for logging money in seconds—whether you
              type, speak, or snap a receipt.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon={<MessageSquare className="size-6 text-blue-500" />}
              title="Voice &amp; natural language"
              description="Log expenses the way you already talk. Hindi, Marathi, Hinglish codemix, English, and 22+ Indian languages—typed or spoken."
              color="bg-blue-500/10"
            />
            <FeatureCard
              icon={<ScanLine className="size-6 text-amber-500" />}
              title="Bill &amp; receipt scan"
              description="Point your camera at a bill. AiXpense pulls merchant, line items, and totals so you spend less time typing (Premium)."
              color="bg-amber-500/10"
            />
            <FeatureCard
              icon={<PieChart className="size-6 text-violet-500" />}
              title="Budgets &amp; analytics"
              description="See where money goes with categories, trends, and budgets that warn you before you overspend."
              color="bg-violet-500/10"
            />
            <FeatureCard
              icon={<Repeat2 className="size-6 text-orange-500" />}
              title="Recurring rules"
              description="Subscriptions, rent, EMIs—set schedules so routine expenses land in your ledger automatically (Premium)."
              color="bg-orange-500/10"
            />
            <FeatureCard
              icon={<Mail className="size-6 text-sky-500" />}
              title="AI spending coach"
              description="Premium includes deeper AI help—weekly and monthly style insights so you can adjust habits with confidence."
              color="bg-sky-500/10"
            />
            <FeatureCard
              icon={<Shield className="size-6 text-green-500" />}
              title="Privacy-first"
              description="Your financial data is yours. We don&apos;t sell it, and you can delete your account and data when you want."
              color="bg-green-500/10"
            />
          </div>
        </section>

        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              See AiXpense in action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Voice-first logging for India, plus scan-to-entry when you
              upgrade.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="p-6 sm:p-8 relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Mic2 className="size-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-full">
                    Demo
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Voice in Hindi, Marathi &amp; Hinglish
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Powered by Sarvam AI&apos;s{" "}
                  <span className="text-foreground font-medium">saaras:v3</span>
                  . Speak naturally; AiXpense turns it into a structured expense
                  in one shot.
                </p>
                <a
                  href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7437362498141593600/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Watch demo on LinkedIn
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden">
              <div className="p-6 sm:p-8 relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Camera className="size-6 text-amber-500" />
                  </div>
                  <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    Premium
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Scan bills, skip the typing
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Attach a receipt photo in chat. AiXpense reads totals and
                  details so you can approve and save in seconds.
                </p>
                <SmartLink
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                >
                  Try AiXpense free
                  <ArrowRight className="size-3.5" />
                </SmartLink>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Three steps from &quot;I should track this&quot; to a clean ledger.
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
                . No rigid fields—just a sentence.
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
                automatically—including income like{" "}
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
                Review, budget, improve
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Search and filter anytime, set monthly budgets with alerts, and
                on Premium get deeper coaching and shareable report cards.
              </p>
            </div>
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
              When you live in the app every day, remove the limits
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Upgrade for unlimited AI back-and-forth, receipt scanning,
              recurring automation, shareable report cards, and priority support.
              Start on the free tier, then unlock Premium from your account when
              you&apos;re ready.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="rounded-full shadow-lg shadow-primary/20" asChild>
                <Link href="/premium">View Premium &amp; pricing</Link>
              </Button>
              <SmartLink variant="outline" className="rounded-full">
                Try free first
              </SmartLink>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 relative">
          <div className="max-w-4xl mx-auto rounded-2xl border border-border/50 bg-card/40 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <BookOpen className="size-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold">From the blog</h2>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-left mb-6">
              Practical guides on budgeting, voice tracking, and picking the
              right expense app in India.
            </p>
            <ul className="space-y-3">
              {BLOG_HIGHLIGHTS.map((post) => (
                <li key={post.href}>
                  <Link
                    href={post.href}
                    className="text-sm sm:text-base font-medium text-primary hover:underline inline-flex items-center gap-2"
                  >
                    {post.title}
                    <ArrowRight className="size-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center sm:text-left">
              <Link
                href="/blog"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse all articles →
              </Link>
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
            <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 space-y-6 flex flex-col">
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
              <SmartLink variant="outline" className="w-full rounded-full">
                Get started free
              </SmartLink>
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
                <Link href="/premium">Buy Premium — monthly</Link>
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
                <Link href="/premium">Buy Premium — yearly</Link>
              </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
            Payments are processed securely (e.g. Razorpay or Dodo depending on
            region). See{" "}
            <Link href="/refund" className="text-primary hover:underline">
              billing &amp; cancellation
            </Link>{" "}
            for renewals, cancellation, and payment terms (including our
            no-refund policy for completed subscription payments).
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
              Ready when you are
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto">
              Open AiXpense, send your first line in plain language, and see the
              ledger update instantly. No credit card required for the free
              tier.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-green-500" /> Voice &
                text
              </div>
              <div className="hidden sm:block text-border">|</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-green-500" /> No ads on
                core tracking
              </div>
              <div className="hidden sm:block text-border">|</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-green-500" /> Works in
                the browser
              </div>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <SmartLink
                size="lg"
                className="h-12 px-8 sm:px-10 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Open the app
              </SmartLink>
              <Button variant="outline" size="lg" className="rounded-full h-12" asChild>
                <Link href="/premium">Compare Premium</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
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
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className="bg-card h-full">
      <CardHeader>
        <div
          className={`size-12 rounded-xl ${color} flex items-center justify-center mb-4`}
        >
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed mt-2">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
