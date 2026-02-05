"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/authClient";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  ExpenseCard,
  IncomeCard,
  ChatEmptyState,
  ChatInput,
  ToolLoading,
} from "@/components/chat";
import { TrialStatus } from "@/components/chat/TrialStatus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Crown } from "lucide-react";

interface UserWithTrial {
  isPremium?: boolean;
  freeTrials?: number;
}

export default function AiXpensePage() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { data: session, isPending: isSessionLoading, refetch } = useSession();

  const user = session?.user as UserWithTrial | undefined;
  const isPremium = user?.isPremium ?? false;
  const freeTrials = user?.freeTrials ?? 0;

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: () => {
      refetch?.();
    },
    onError: (error) => {
      if (
        error.message.includes("No free trials remaining") ||
        error.message.includes("403")
      ) {
        setShowUpgradeDialog(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const isLoading = status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!isPremium && freeTrials <= 0) {
      setShowUpgradeDialog(true);
      return;
    }
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    if (!isPremium && freeTrials <= 0) {
      setShowUpgradeDialog(true);
      return;
    }
    sendMessage({ text: suggestion });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && <ChatEmptyState />}

          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, index) => {
                  if (part.type === "reasoning") {
                    const isLastPart = index === message.parts.length - 1;
                    const isLastMessage = message.id === messages.at(-1)?.id;
                    const isCurrentlyStreaming =
                      status === "streaming" && isLastPart && isLastMessage;

                    const reasoningText =
                      (part as { text?: string; reasoning?: string }).text ||
                      (part as { text?: string; reasoning?: string })
                        .reasoning ||
                      "";

                    return (
                      <Reasoning
                        key={`${message.id}-${index}`}
                        className="w-full mb-3"
                        isStreaming={isCurrentlyStreaming}
                      >
                        <ReasoningTrigger />
                        {reasoningText && (
                          <ReasoningContent>{reasoningText}</ReasoningContent>
                        )}
                      </Reasoning>
                    );
                  }

                  if (part.type === "text") {
                    return (
                      <MessageResponse key={`${message.id}-${index}`}>
                        {part.text}
                      </MessageResponse>
                    );
                  }

                  if (part.type === "tool-saveExpense") {
                    if (part.state === "output-available" && part.output) {
                      const expense = (
                        part.output as {
                          expense: {
                            item: string;
                            amount: number;
                            category: string;
                            subcategory?: string;
                            tags?: string[];
                          };
                        }
                      ).expense;

                      return (
                        <ExpenseCard
                          key={`${message.id}-${index}`}
                          {...expense}
                        />
                      );
                    }

                    if (
                      part.state === "input-streaming" ||
                      part.state === "input-available"
                    ) {
                      return (
                        <ToolLoading
                          key={`${message.id}-${index}`}
                          type="expense"
                        />
                      );
                    }
                  }

                  if (part.type === "tool-saveIncome") {
                    if (part.state === "output-available" && part.output) {
                      const income = (
                        part.output as {
                          income: {
                            source: string;
                            amount: number;
                            category: string;
                            subcategory?: string;
                            tags?: string[];
                          };
                        }
                      ).income;

                      return (
                        <IncomeCard
                          key={`${message.id}-${index}`}
                          {...income}
                        />
                      );
                    }

                    if (part.state === "output-error") {
                      return (
                        <div
                          key={`${message.id}-${index}`}
                          className="text-red-500 text-sm"
                        >
                          Error saving income:{" "}
                          {part.errorText || "Unknown error"}
                        </div>
                      );
                    }

                    if (
                      part.state === "input-streaming" ||
                      part.state === "input-available"
                    ) {
                      return (
                        <ToolLoading
                          key={`${message.id}-${index}`}
                          type="income"
                        />
                      );
                    }
                  }

                  return null;
                })}
              </MessageContent>
            </Message>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <Message from="assistant">
              <MessageContent>
                <ToolLoading type="thinking" />
              </MessageContent>
            </Message>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onSuggestionClick={handleSuggestionClick}
        isLoading={isLoading}
      />

      <div className="absolute top-4 right-4 z-10">
        {!isSessionLoading && user && (
          <TrialStatus
            isPremium={isPremium}
            freeTrials={freeTrials}
            onUpgradeClick={() => setShowUpgradeDialog(true)}
          />
        )}
      </div>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="size-5 text-amber-500" />
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription>
              You&apos;ve used all your free AI interactions for this account.
              Upgrade to Premium to unlock unlimited access.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Free Plan</span>
                <span className="text-muted-foreground">5 messages / user</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Premium Plan</span>
                <span className="text-primary">Unlimited</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button>Upgrade Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
