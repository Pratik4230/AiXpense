"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/app/(protected)/aixpense/actions";
import {
  Sparkles,
  MessageSquare,
  BarChart3,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/10",
    title: "Welcome to AiXpense",
    description:
      "Your AI-powered personal finance assistant. Track expenses, income, and budgets — just by chatting.",
    highlight: null,
  },
  {
    icon: MessageSquare,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    title: "Just type naturally",
    description:
      "No forms to fill. Just tell AiXpense what you spent in plain language and it handles the rest.",
    highlight: {
      examples: [
        "Spent ₹450 on groceries at DMart",
        "Paid ₹1,200 electricity bill",
        "Got ₹50,000 salary today",
        "How much did I spend this month?",
      ],
    },
  },
  {
    icon: BarChart3,
    iconColor: "text-green-400",
    iconBg: "bg-green-400/10",
    title: "Insights on demand",
    description:
      "Ask anything about your finances. Get spending breakdowns, category summaries, and trends — instantly.",
    highlight: {
      examples: [
        "Show my food expenses this week",
        "What's my biggest expense category?",
        "Compare this month vs last month",
      ],
    },
  },
];

interface OnboardingModalProps {
  open: boolean;
}

export function OnboardingModal({ open }: OnboardingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  function finish() {
    setDone(true);
    startTransition(async () => {
      await completeOnboarding();
      router.refresh();
    });
  }

  function handleNext() {
    if (isLast) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <Dialog open={open && !done} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden gap-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>{current.title}</DialogTitle>
          <DialogDescription>{current.description}</DialogDescription>
        </VisuallyHidden>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl ${current.iconBg}`}>
              <Icon className={`size-5 ${current.iconColor}`} />
            </div>
            <button
              onClick={finish}
              disabled={isPending}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Skip
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              {current.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {current.description}
            </p>
          </div>

          {current.highlight && (
            <div className="rounded-xl border bg-muted/40 divide-y divide-border/60">
              {current.highlight.examples.map((ex) => (
                <div
                  key={ex}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm"
                >
                  <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground/80">{ex}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-5 bg-primary"
                      : i < step
                        ? "w-1.5 bg-primary/40"
                        : "w-1.5 bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={isPending}
              size="sm"
              className="gap-1.5"
            >
              {isLast ? "Get started" : "Next"}
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
