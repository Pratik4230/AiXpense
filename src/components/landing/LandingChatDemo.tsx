"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type DemoMessage =
  | { role: "user"; text: string }
  | { role: "assistant"; title: string; body: string; rows: Array<[string, string]> };

const CONVERSATIONS: Array<{ label: string; messages: DemoMessage[] }> = [
  {
    label: "Expense capture",
    messages: [
      { role: "user", text: "Zomato 450 for dinner" },
      {
        role: "assistant",
        title: "Expense added successfully",
        body: "Your dinner expense is ready to review.",
        rows: [["Item", "Zomato"], ["Amount", "₹450.00"], ["Category", "Food & Dining"], ["Date", "Today"]],
      },
      { role: "user", text: "Show my food spending this month" },
      {
        role: "assistant",
        title: "Food spending this month",
        body: "You have 14 food transactions so far.",
        rows: [["Total", "₹4,260.00"], ["Largest", "Dining out"], ["Trend", "Within your usual range"]],
      },
    ],
  },
  {
    label: "Budget tracking",
    messages: [
      { role: "user", text: "Set my food budget to ₹8,000 this month" },
      {
        role: "assistant",
        title: "Budget created",
        body: "I’ll keep an eye on food and dining spending.",
        rows: [["Monthly limit", "₹8,000"], ["Used so far", "₹4,260"], ["Remaining", "₹3,740"]],
      },
      { role: "user", text: "How much can I spend per day?" },
      {
        role: "assistant",
        title: "Daily budget guidance",
        body: "To stay on track for the rest of the month:",
        rows: [["Recommended daily limit", "₹187"], ["Status", "On track"], ["Alert", "Near-limit alerts enabled"]],
      },
    ],
  },
  {
    label: "Monthly report",
    messages: [
      { role: "user", text: "Give me my monthly spending report" },
      {
        role: "assistant",
        title: "Your monthly report is ready",
        body: "Here’s a quick view of where your money went.",
        rows: [["Total expenses", "₹28,450"], ["Top category", "Food & Dining"], ["Compared with last month", "12% lower"]],
      },
      { role: "user", text: "What should I pay attention to?" },
      {
        role: "assistant",
        title: "One useful observation",
        body: "Dining out increased this month while transport spending fell. Your food budget is the best place to review first.",
        rows: [["Suggested action", "Review dining transactions"], ["Next step", "Open spending report"]],
      },
    ],
  },
];

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

export function LandingChatDemo() {
  const [conversationIndex, setConversationIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const timeoutsRef = useRef<number[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const conversation = CONVERSATIONS[conversationIndex];

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    const reset = window.setTimeout(
      () => setVisibleMessages(reducedMotion ? conversation.messages.length : 0),
      0,
    );
    timeoutsRef.current.push(reset);

    if (reducedMotion) {
      return () => undefined;
    }

    conversation.messages.forEach((_, index) => {
      const timeout = window.setTimeout(() => setVisibleMessages(index + 1), index * 1150 + 320);
      timeoutsRef.current.push(timeout);
    });

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [conversation, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || visibleMessages !== conversation.messages.length) return;
    const loop = window.setTimeout(() => setConversationIndex((index) => (index + 1) % CONVERSATIONS.length), 10500);
    return () => window.clearTimeout(loop);
  }, [conversation, reducedMotion, visibleMessages]);

  const replay = () => setConversationIndex((index) => (index + 1) % CONVERSATIONS.length);

  return (
    <section id="chat-demo" aria-labelledby="chat-demo-heading" className="scroll-mt-24 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">Live product examples</p>
            <h2 id="chat-demo-heading" className="text-lg font-semibold sm:text-xl">Watch it work</h2>
            <p className="mt-1 text-sm text-muted-foreground">From a quick expense to budgets, alerts and monthly insights  -  all in one conversation.</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="self-center rounded-full gap-2 sm:self-end" onClick={replay}>
            <RotateCcw className="size-3.5" aria-hidden /> Replay example
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl shadow-primary/5 ring-1 ring-border/30">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3"><div className="flex items-center gap-2"><div className="flex gap-1.5" aria-hidden><span className="size-3 rounded-full bg-red-500/80" /><span className="size-3 rounded-full bg-yellow-500/80" /><span className="size-3 rounded-full bg-green-500/80" /></div><span className="ml-3 text-xs font-medium text-muted-foreground">AiXpense Assistant</span></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">{conversation.label}</span></div>
          <div className="min-h-[26rem] space-y-5 p-4 text-left sm:min-h-[31rem] sm:p-8">
            {conversation.messages.slice(0, visibleMessages).map((message, index) => message.role === "user" ? (
              <div key={`${conversation.label}-${index}`} className="flex animate-in justify-end fade-in slide-in-from-bottom-2 duration-500"><div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-md sm:max-w-[78%]">{message.text}</div></div>
            ) : (
              <div key={`${conversation.label}-${index}`} className="flex max-w-[96%] animate-in items-start gap-3 fade-in slide-in-from-bottom-2 duration-500 sm:max-w-[90%]"><div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-amber-400 text-white shadow-lg"><Sparkles className="size-4" /></div><div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-border/60 bg-muted/50 p-4 sm:p-5"><p className="text-sm font-semibold">{message.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{message.body}</p><div className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-xs sm:text-sm">{message.rows.map(([label, value]) => <div key={label} className="contents"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground">{value}</span></div>)}</div></div></div>
            ))}
            {!reducedMotion && visibleMessages < conversation.messages.length ? <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="flex gap-1"><span className="size-1.5 animate-pulse rounded-full bg-primary" /><span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" /><span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" /></span>AiXpense is thinking…</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
