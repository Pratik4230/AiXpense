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
} from "lucide-react";
import { SmartLink, SmartTextLink } from "@/components/auth/SmartLink";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AiXpense",
  url: "https://aixpense.in",
  description:
    "AI-powered expense tracker. Track income and expenses using natural language. Just type 'Lunch 250' and AiXpense categorizes and logs it instantly.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      name: "Free Plan",
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
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

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
          <SmartTextLink className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Login
          </SmartTextLink>
          <SmartLink className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            Get Started
          </SmartLink>
        </div>
      </header>

      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-default"
            >
              <Zap className="size-3.5 mr-2 fill-primary" />
              <span>AI-Powered Expense Tracking</span>
            </Badge>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Track expenses with <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Natural Language
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Stop filling out boring forms. Just type{" "}
            <span className="text-foreground font-medium">
              &quot;Lunch 250&quot;
            </span>{" "}
            or{" "}
            <span className="text-foreground font-medium">
              &quot;Uber to office 400&quot;
            </span>
            . Our AI handles the categorization, tagging, and dates instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <SmartLink
              size="lg"
              className="h-12 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all"
            >
              Start Tracking Free
              <ArrowRight className="ml-2 size-5" />
            </SmartLink>
          </div>

          {/* Chat Demo UI */}
          <div className="mt-20 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
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
              <div className="p-6 sm:p-8 space-y-6 text-left">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                    <p className="text-sm sm:text-base">
                      Ordered Pizza for team lunch 1200rs
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start gap-4 max-w-[90%]">
                  <div className="size-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted/50 border border-border/50 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm backdrop-blur-sm">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Expense added successfully!
                      </p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="text-muted-foreground">Item</div>
                        <div className="font-medium">Pizza</div>

                        <div className="text-muted-foreground">Amount</div>
                        <div className="font-medium">₹1,200.00</div>

                        <div className="text-muted-foreground">Category</div>
                        <div className="font-medium text-purple-400">
                          Food & Dining
                        </div>

                        <div className="text-muted-foreground">Tags</div>
                        <div className="font-medium text-xs flex gap-1">
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
            {/* Glow under the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[50%] bg-primary/20 blur-[80px] -z-10 rounded-full" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why use AiXpense?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for speed and simplicity. We stripped away the complex forms
              and kept only what matters.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 max-w-6xl mx-auto">
            <FeatureCard
              icon={<MessageSquare className="size-6 text-blue-500" />}
              title="Natural Language"
              description="Type like you talk. Our advanced AI parses your text to extract every detail accurately."
              color="bg-blue-500/10"
            />
            <FeatureCard
              icon={<PieChart className="size-6 text-purple-500" />}
              title="Smart Analytics"
              description="Visualize your spending habits with beautiful, auto-generated charts and insights."
              color="bg-purple-500/10"
            />
            <FeatureCard
              icon={<Shield className="size-6 text-green-500" />}
              title="Bank-Grade Security"
              description="Your financial data is encrypted and stored securely. We prioritize your privacy above all."
              color="bg-green-500/10"
            />
          </div>
        </section>

        {/* CTA Section */}

        {/* How it works Section */}
        <section className="py-24 sm:py-32 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How AiXpense works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start tracking your income and expenses in under 30 seconds. No
              setup. No spreadsheets. No categories to configure.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 max-w-6xl mx-auto">
            <div className="relative flex flex-col items-start p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Type your expense naturally
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Just write what you spent — in plain English or Hindi. Try{" "}
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

            <div className="relative flex flex-col items-start p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                AI categorizes it instantly
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI automatically detects the amount, merchant, category,
                tags, and date. Income vs expense is handled too — just say{" "}
                <span className="text-foreground font-medium">
                  &quot;received salary 50000&quot;
                </span>
                .
              </p>
            </div>

            <div className="relative flex flex-col items-start p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              <div className="size-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 text-green-400 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Track, budget &amp; analyse
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                View spending reports by category, set monthly budgets with
                alerts, and get AI-powered insights on where your money actually
                goes — all in real time.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}

        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl border border-border bg-linear-to-b from-muted/50 to-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to take control?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of users who are saving time and money with
              AiXpense. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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

            <div className="mt-10">
              <SmartLink
                size="lg"
                className="h-12 px-10 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
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
    <Card className="group hover:border-primary/20 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div
          className={`size-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
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
