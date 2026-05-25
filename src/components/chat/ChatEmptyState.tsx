"use client";

import {
  Wallet,
  TrendingUp,
  Search,
  PieChart,
  Camera,
  ArrowLeftRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOL_GROUPS: {
  icon: LucideIcon;
  label: string;
  examples: string[];
}[] = [
  {
    icon: Wallet,
    label: "Add expense",
    examples: ["Coffee 120", "Paid rent 12,000", "Grocery bill 850 at DMart"],
  },
  {
    icon: TrendingUp,
    label: "Log income",
    examples: [
      "Salary received 55,000",
      "Freelance payment 8,000",
      "Got cashback 250",
    ],
  },
  {
    icon: Search,
    label: "Search & insights",
    examples: [
      "How much did I spend on food this month?",
      "Show last 5 transactions",
      "Total income vs expenses",
    ],
  },
  {
    icon: PieChart,
    label: "Budgets",
    examples: [
      "Set food budget to 5,000",
      "Show my budgets",
      "Delete my travel budget",
    ],
  },
  {
    icon: Camera,
    label: "Scan a bill",
    examples: ["Scan this receipt", "Read the bill in the photo"],
  },
  {
    icon: ArrowLeftRight,
    label: "Edit or delete",
    examples: ["What currencies are supported?"],
  },
];

const SCAN_BILL_GROUP_LABEL = "Scan a bill";

interface ChatEmptyStateProps {
  onSuggestionClick?: (suggestion: string) => void;
  onScanBillClick?: (suggestion: string) => void;
  disabled?: boolean;
}

export function ChatEmptyState({
  onSuggestionClick,
  onScanBillClick,
  disabled,
}: ChatEmptyStateProps) {
  const hasActions = Boolean(onSuggestionClick || onScanBillClick);

  const onTap = (groupLabel: string, text: string) => {
    if (disabled) return;
    if (groupLabel === SCAN_BILL_GROUP_LABEL && onScanBillClick) {
      onScanBillClick(text);
      return;
    }
    onSuggestionClick?.(text);
  };

  return (
    <div className="flex flex-col px-5 pt-2 pb-8 select-none">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            "relative size-12 shrink-0 rounded-[14px] border overflow-hidden",
            "border-orange-500/30 dark:border-orange-400/40",
            "flex items-center justify-center",
          )}
        >
          <div
            className={cn(
              "absolute inset-0",
              "bg-gradient-to-br from-orange-500/20 to-orange-500/5",
              "dark:from-orange-400/30 dark:to-orange-400/5",
            )}
          />
          <span className="relative text-xl font-extralight text-primary">
            ✦
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
            AiXpense
          </p>
          <p className="text-xs font-medium text-muted-foreground mt-0.5 tracking-wide">
            Your private finance assistant
          </p>
        </div>
      </div>

      <h2 className="mt-7 text-[26px] font-semibold text-foreground leading-tight tracking-[-0.4px]">
        What can I help
        <br />
        you with today?
      </h2>

      {hasActions ? (
        <div className="mt-6 flex flex-col gap-5">
          {TOOL_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.label} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 pl-0.5">
                  <div
                    className={cn(
                      "size-[26px] rounded-lg border flex items-center justify-center",
                      "border-border/80",
                    )}
                  >
                    <Icon className="size-4 text-primary" strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {group.label}
                  </span>
                </div>

                <div
                  className={cn(
                    "rounded-[18px] border overflow-hidden",
                    "bg-card/90 dark:bg-card/85 border-border/70",
                  )}
                >
                  {group.examples.map((ex, idx) => (
                    <button
                      key={ex}
                      type="button"
                      disabled={disabled}
                      onClick={() => onTap(group.label, ex)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-3.5 text-left",
                        "text-sm font-medium text-muted-foreground",
                        "hover:bg-muted/40 transition-opacity",
                        "disabled:opacity-45 disabled:cursor-not-allowed",
                        idx < group.examples.length - 1 && "border-b border-border/80",
                      )}
                    >
                      <span className="flex-1 truncate">{ex}</span>
                      <ArrowRight
                        className="size-3.5 shrink-0 text-primary opacity-80"
                        strokeWidth={2.5}
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-xs text-muted-foreground text-center mt-0.5 opacity-70 leading-relaxed">
            Tap any example or type your own below.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          Log expenses, income, set budgets, or ask anything about your finances
          — all in plain language.
        </p>
      )}
    </div>
  );
}
