"use client";

import { Sparkles } from "lucide-react";
import { SUGGESTIONS } from "@/constants/suggestions";
import { cn } from "@/lib/utils";

const NODES = [
  { x: 12.5, y: 27 },
  { x: 12.5, y: 73 },
  { x: 50, y: 12 },
  { x: 50, y: 50 },
  { x: 50, y: 88 },
  { x: 87.5, y: 27 },
  { x: 87.5, y: 73 },
];

const EDGES = [
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [3, 5],
  [3, 6],
  [4, 5],
  [4, 6],
];

interface ChatEmptyStateProps {
  onSuggestionClick?: (suggestion: string) => void;
  isLoading?: boolean;
}

export function ChatEmptyState({
  onSuggestionClick,
  isLoading,
}: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center select-none gap-8 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl scale-150 opacity-60" />
          <div className="relative size-20 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/10">
            <Sparkles className="size-9 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            AiXpense Assistant
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            Track expenses & income by just typing naturally.
          </p>
        </div>
      </div>

      {onSuggestionClick && (
        <div className="relative w-full max-w-150 h-55">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {EDGES.map(([a, b], i) => {
              const from = NODES[a];
              const to = NODES[b];
              const pathD = `M${from.x},${from.y} L${to.x},${to.y}`;
              const dur = `${1.8 + (i % 5) * 0.4}s`;
              const delay = `${(i * 0.3) % 2}s`;
              return (
                <g key={i}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="currentColor"
                    strokeWidth="0.3"
                    className="text-border"
                    strokeOpacity="0.6"
                  />
                  <circle r="0.9" fill="var(--primary)" fillOpacity="0.85">
                    <animateMotion
                      dur={dur}
                      begin={delay}
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {SUGGESTIONS.map((s, i) => {
            const node = NODES[i];
            return (
              <div
                key={s}
                className="suggestion-beam rounded-full p-px absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => onSuggestionClick(s)}
                  className={cn(
                    "block px-3 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap",
                    "bg-background text-muted-foreground",
                    "hover:bg-primary/5 hover:text-foreground",
                    "transition-all duration-200",
                    "disabled:opacity-30 disabled:cursor-not-allowed",
                  )}
                >
                  {s}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
