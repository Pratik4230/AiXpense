"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const USER_MESSAGE = "Zomato 450";

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

export function LandingChatDemo() {
  const [replayKey, setReplayKey] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [showReply, setShowReply] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  };

  useEffect(() => {
    clearTimers();

    const run = () => {
      setDisplayed("");
      setShowReply(false);

      if (reducedMotion) {
        setDisplayed(USER_MESSAGE);
        setShowReply(true);
        return;
      }

      schedule(() => {
        let i = 0;
        const typeNext = () => {
          i += 1;
          setDisplayed(USER_MESSAGE.slice(0, i));
          if (i < USER_MESSAGE.length) {
            schedule(typeNext, 38);
          } else {
            schedule(() => setShowReply(true), 480);
          }
        };
        typeNext();
      }, 320);
    };

    queueMicrotask(run);

    return clearTimers;
  }, [replayKey, reducedMotion]);

  useEffect(() => {
    if (!showReply || reducedMotion) return;
    const loopId = setTimeout(() => {
      setReplayKey((k) => k + 1);
    }, 12000);
    return () => clearTimeout(loopId);
  }, [showReply, reducedMotion]);

  return (
    <section
      id="chat-demo"
      aria-labelledby="chat-demo-heading"
      className="py-10 sm:py-14 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto px-0 sm:px-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4 text-center sm:text-left">
          <div>
            <h2
              id="chat-demo-heading"
              className="text-lg sm:text-xl font-semibold text-foreground"
            >
              Watch it work
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              One line in chat becomes a structured expense no forms.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full shrink-0 self-center sm:self-end gap-2"
            onClick={() => setReplayKey((k) => k + 1)}
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Replay
          </Button>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card shadow-xl shadow-primary/5 overflow-hidden ring-1 ring-border/30">
          <div className="border-b border-border/50 px-4 py-3 flex items-center gap-2 bg-muted/30">
            <div className="flex gap-1.5" aria-hidden>
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-yellow-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
            </div>
            <div className="ml-4 text-xs font-medium text-muted-foreground/70">
              AiXpense Assistant
            </div>
          </div>
          <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 text-left min-h-[14rem] sm:min-h-[16rem]">
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl rounded-tr-sm max-w-[90%] shadow-md">
                <p className="text-sm sm:text-base font-medium tabular-nums">
                  {displayed}
                  {!reducedMotion && displayed.length < USER_MESSAGE.length ? (
                    <span className="inline-block w-0.5 h-4 sm:h-5 ml-0.5 align-[-2px] bg-primary-foreground/80 animate-pulse" />
                  ) : null}
                </p>
              </div>
            </div>

            {showReply ? (
              <div className="flex items-start gap-3 sm:gap-4 max-w-[95%] sm:max-w-[92%] animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="size-8 sm:size-9 rounded-full bg-linear-to-br from-primary to-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                  <Sparkles className="size-4 text-white" />
                </div>
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="bg-muted border border-border/50 px-3 py-3 sm:px-5 sm:py-4 rounded-2xl rounded-tl-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Expense added successfully!
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 sm:gap-x-10 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Item</div>
                      <div className="font-medium">Zomato</div>
                      <div className="text-muted-foreground">Amount</div>
                      <div className="font-medium">₹450.00</div>
                      <div className="text-muted-foreground">Category</div>
                      <div className="font-medium text-amber-400">
                        Food &amp; Dining
                      </div>
                      <div className="text-muted-foreground">Tags</div>
                      <div className="font-medium text-xs flex flex-wrap gap-1">
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          #food
                        </span>
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          #delivery
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
