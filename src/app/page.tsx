import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  PieChart,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Mic2,
  Camera,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { SmartLink, SmartTextLink } from "@/components/auth/SmartLink";
import { Button } from "@/components/ui/button";
import { AndroidBetaDialog } from "@/components/landing/AndroidBetaDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Expense Tracker - AI Expense Manager App | Track Expenses by Voice | AiXpense",
  description:
    "Best free AI expense tracker app for India. Track daily expenses and income by voice in Hindi, Marathi & 22+ languages, text, or bill scan. Smart expense manager with auto-categorization, budget alerts, spending reports & analytics. No forms needed - just say 'Lunch 250'.",
  alternates: { canonical: "https://aixpense.in" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pratik Jadhav",
  url: "https://www.linkedin.com/in/pratikjadhav1438/",
  sameAs: [
    "https://www.linkedin.com/in/pratikjadhav1438/",
    "https://x.com/Pratik4230",
    "https://twitter.com/Pratik4230",
  ],
  jobTitle: "Founder",
  worksFor: {
    "@type": "Organization",
    name: "AiXpense",
    url: "https://aixpense.in",
  },
};

const faqs = [
  {
    q: "Is AiXpense free to use?",
    a: "Yes. The free plan gives you 7 AI messages per day with full expense tracking, categorization, and search. No credit card needed to start.",
  },
  {
    q: "Does it work in Hindi, Marathi, or Hinglish?",
    a: "Yes. AiXpense supports voice input in 22+ Indian languages via Sarvam AI, including Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia, and more, plus Hinglish codemix. You can also type in any of these languages.",
  },
  {
    q: "How is my financial data kept safe?",
    a: "We never share or sell your data. You can delete your account and all associated data at any time.",
  },
  {
    q: "What exactly does the AI do?",
    a: 'When you type or say something like "Uber to airport 650", the AI extracts the item name, amount, date, category, and tags and saves them instantly. No forms to fill.',
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes. AiXpense is a web app that works on any device. Open it in your mobile browser and it feels like a native app. No download required.",
  },
  {
    q: "What is the difference between the free and premium plans?",
    a: "The free plan has a limit of 7 AI messages per day. Premium removes all limits and adds an AI spending coach that sends you weekly and monthly insights by email, plus advanced features like receipt scanning.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AiXpense - AI Expense Tracker",
  alternateName: ["AiXpense", "AI Xpense", "AI Expense Tracker"],
  url: "https://aixpense.in",
  description:
    "Best AI expense tracker app for India. Track daily expenses and income by voice, text, or bill scan in Hindi, Marathi, English & 22+ Indian languages. Free expense manager with budget tracking, spending analytics & AI auto-categorization.",
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Expense Tracker",
  operatingSystem: "Web",
  inLanguage: ["en", "hi", "mr", "ta", "te", "bn", "gu", "kn", "ml", "pa"],
  featureList: [
    "Voice expense tracking in 22+ Indian languages",
    "AI auto-categorization of expenses",
    "Bill and receipt scanning",
    "Monthly budget tracking with alerts",
    "Spending analytics and reports",
    "Income and expense management",
    "Natural language input",
  ],
  screenshot: "https://aixpense.in/og-image.png",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      name: "Free Plan",
      description: "7 AI messages per day with full expense tracking",
    },
    {
      "@type": "Offer",
      price: "499",
      priceCurrency: "INR",
      name: "Premium Monthly",
      billingIncrement: "P1M",
    },
    {
      "@type": "Offer",
      price: "3999",
      priceCurrency: "INR",
      name: "Premium Yearly",
      billingIncrement: "P1Y",
    },
  ],
  author: {
    "@type": "Person",
    name: "Pratik Jadhav",
    url: "https://www.linkedin.com/in/pratikjadhav1438/",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Background Gradients */}


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
            triggerClassName="rounded-full hidden sm:inline-flex"
          />
          <SmartTextLink className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Login
          </SmartTextLink>
          <SmartLink className="rounded-full px-6">
            Get Started
          </SmartLink>
        </div>
      </header>

      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <section className="py-14 sm:py-24 lg:py-32 text-center max-w-5xl mx-auto flex flex-col items-center">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary cursor-default"
          >
            <Zap className="size-3.5 mr-2 fill-primary" />
            <span>AI-Powered Expense Tracking</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.15]">
            AI Expense Tracker with <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Voice & Natural Language
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop filling out boring forms. Just type{" "}
            <span className="text-foreground font-medium">
              &quot;Lunch 250&quot;
            </span>
            , speak in Hindi, Marathi, or 22+ Indian languages, or scan your
            bill images. The best free expense tracker app that handles
            categorization, budgets, and analytics instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <SmartLink
              size="lg"
              className="h-12 px-8 rounded-full text-base sm:text-lg"
            >
              Start Tracking Free
              <ArrowRight className="ml-2 size-5" />
            </SmartLink>
            <AndroidBetaDialog
              size="lg"
              triggerLabel="Get it on Android"
              triggerClassName="h-12 px-8 rounded-full text-base sm:text-lg"
            />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs sm:text-sm text-muted-foreground">
            <Smartphone className="size-3.5 sm:size-4 text-primary" />
            Android app in closed beta on Google Play
          </div>

          {/* Chat Demo UI */}
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
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md">
                    <p className="text-sm sm:text-base">
                      Ordered Pizza for team lunch 1200rs
                    </p>
                  </div>
                </div>

                {/* AI Response */}
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

        {/* Features Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Why AiXpense is the Best Expense Tracker
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Built for speed and simplicity. We stripped away the complex forms
              and kept only what matters.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 sm:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon={<MessageSquare className="size-6 text-blue-500" />}
              title="Voice & Text Input"
              description="Type like you talk or speak in 22+ Indian languages. Our advanced AI extracts every detail accurately."
              color="bg-blue-500/10"
            />
            <FeatureCard
              icon={<PieChart className="size-6 text-amber-500" />}
              title="Smart Analytics"
              description="Visualize your spending habits with beautiful, auto-generated charts and insights."
              color="bg-amber-500/10"
            />
            <FeatureCard
              icon={<Shield className="size-6 text-green-500" />}
              title="Bank-Grade Security"
              description="Your financial data is encrypted and stored securely. We prioritize your privacy above all."
              color="bg-green-500/10"
            />
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              See the AI Expense Tracker in Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Real demos of voice expense tracking and bill scanning features.
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
                    Live
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Voice Input in Hindi, Marathi &amp; Hinglish
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Powered by Sarvam AI&apos;s{" "}
                  <span className="text-foreground font-medium">saaras:v3</span>{" "}
                  model. Speak naturally in codemix and AiXpense understands and
                  logs your expense instantly.
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
                  <span className="text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-full">
                    Live
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Bill Scan: Point &amp; Log
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Snap a photo of any receipt or bill. AiXpense extracts the
                  merchant, amount, and items automatically. No typing needed.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                  Try it out now
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              How to Track Expenses with AI
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Start tracking your income and expenses in under 30 seconds. No
              setup. No spreadsheets. No categories to configure.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 sm:grid-cols-3 max-w-6xl mx-auto">
            <div className="relative flex flex-col items-start p-6 sm:p-8 rounded-2xl border border-border/50 bg-card">
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 sm:mb-6 text-primary font-bold text-xl">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Type your expense naturally
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Just write what you spent in plain English or Hindi. Try{" "}
                <span className="text-foreground font-medium">
                  &quot;Zomato dinner 450&quot;
                </span>{" "}
                or{" "}
                <span className="text-foreground font-medium">
                  &quot;petrol 800 today&quot;
                </span>
                . No forms, no dropdowns.
              </p>
            </div>

            <div className="relative flex flex-col items-start p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 sm:mb-6 text-orange-400 font-bold text-xl">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                AI categorizes it instantly
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Our AI automatically detects the amount, merchant, category,
                tags, and date. Income vs expense is handled too. Just say{" "}
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
                Track, budget &amp; analyse
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                View spending reports by category, set monthly budgets with
                alerts, and get AI-powered insights on where your money actually
                goes, all in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto items-start">
            <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Free
                </p>
                <p className="text-4xl font-bold">₹0</p>
                <p className="text-sm text-muted-foreground mt-1">
                  7 messages / day
                </p>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "7 AI messages per day",
                  "Voice input in 22+ Indian languages",
                  "Expense & income tracking",
                  "Search & filter transactions",
                ].map((f) => (
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
                Get Started Free
              </SmartLink>
            </div>

            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 sm:p-8 space-y-6 relative">
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
                  Advanced features
                </p>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "Everything in Free",
                  "AI spending coach (weekly/monthly)",
                  "Shareable report cards",
                  "Priority support",
                ].map((f) => (
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
                <Link href="/premium">Upgrade to Premium</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Best Value
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Premium Yearly
                </p>
                <div className="flex items-end gap-1">
                  <p className="text-4xl font-bold">₹4,000</p>
                  <p className="text-muted-foreground mb-1">/year</p>
                </div>
                <p className="text-sm text-green-500 font-medium mt-1">
                  Save ₹2,000 vs monthly
                </p>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "Everything in Premium",
                  "2 months free",
                  "Locked-in pricing",
                  "Receipt scanning",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full rounded-full bg-amber-500 hover:bg-amber-500/90 text-white border-0 shadow-lg shadow-amber-500/20"
                asChild
              >
                <Link href="/premium">Get Best Value</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              Everything you need to know before getting started.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="max-w-2xl mx-auto divide-y divide-border/50"
          >
            {faqs.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-0 py-1"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 text-center">
          <div className="max-w-4xl mx-auto p-6 sm:p-12 rounded-3xl border border-border bg-linear-to-b from-muted/50 to-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Ready to take control?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto">
              Join thousands of users who are saving time and money with
              AiXpense. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-green-500" /> Start in
                Seconds
              </div>
              <div className="hidden sm:block text-border">|</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-green-500" /> No ads
              </div>
              <div className="hidden sm:block text-border">|</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-green-500" /> Mobile
                Friendly
              </div>
            </div>

            <div className="mt-8 sm:mt-10">
              <SmartLink
                size="lg"
                className="h-12 px-8 sm:px-10 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Now
              </SmartLink>
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
              Terms & Conditions
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
              Refund Policy
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
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className="bg-card">
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
