"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/authClient";
import { useRouter } from "next/navigation";
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
  UpdatedCard,
  DeletedCard,
  ChatEmptyState,
  ChatInput,
  ToolLoading,
  type SelectedTransaction,
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
  const router = useRouter();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<SelectedTransaction | null>(null);
  const [outdatedIds, setOutdatedIds] = useState<Set<string>>(new Set());
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
    if (!isPremium && freeTrials <= 0) {
      setShowUpgradeDialog(true);
      return;
    }

    if (selectedTransaction) {
      const prefix = `[ATTACHED_TRANSACTION: id=${selectedTransaction.id}, type=${selectedTransaction.type}, item=${selectedTransaction.item}, amount=${selectedTransaction.amount}, action=${selectedTransaction.action}]`;
      const messageText =
        selectedTransaction.action === "delete"
          ? prefix
          : `${prefix} ${input}`.trim();

      if (selectedTransaction.action === "delete" || input.trim()) {
        sendMessage({ text: messageText });
        setInput("");
        setSelectedTransaction(null);
      }
      return;
    }

    if (!input.trim() || isLoading) return;
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

  const handleUpgradeClick = () => {
    setShowUpgradeDialog(false);
    router.push("/premium");
  };

  const handleTransactionEdit = (data: {
    id: string;
    item: string;
    amount: number;
    category: string;
  }) => {
    setSelectedTransaction({
      ...data,
      type: "expense",
      action: "edit",
    });
  };

  const handleTransactionDelete = (data: {
    id: string;
    item: string;
    amount: number;
    category: string;
  }) => {
    setSelectedTransaction({
      ...data,
      type: "expense",
      action: "delete",
    });
  };

  const handleIncomeEdit = (data: {
    id: string;
    item: string;
    amount: number;
    category: string;
  }) => {
    setSelectedTransaction({
      ...data,
      type: "income",
      action: "edit",
    });
  };

  const handleIncomeDelete = (data: {
    id: string;
    item: string;
    amount: number;
    category: string;
  }) => {
    setSelectedTransaction({
      ...data,
      type: "income",
      action: "delete",
    });
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
                    let displayText = part.text;
                    if (
                      message.role === "user" &&
                      displayText.includes("[ATTACHED_TRANSACTION:")
                    ) {
                      const actionMatch = displayText.match(/action=(\w+)/);
                      const itemMatch = displayText.match(/item=([^,\]]+)/);
                      const amountMatch = displayText.match(/amount=(\d+)/);
                      const action = actionMatch?.[1];
                      const itemName = itemMatch?.[1];
                      const amount = amountMatch?.[1];
                      const userText = displayText
                        .split("]")
                        .slice(1)
                        .join("]")
                        .trim();

                      if (action === "delete") {
                        displayText = `Delete: ${itemName} (₹${amount})`;
                      } else {
                        displayText = userText
                          ? `Edit ${itemName}: ${userText}`
                          : `Edit: ${itemName} (₹${amount})`;
                      }
                    }
                    return (
                      <MessageResponse key={`${message.id}-${index}`}>
                        {displayText}
                      </MessageResponse>
                    );
                  }

                  if (part.type === "tool-saveExpense") {
                    if (part.state === "output-available" && part.output) {
                      const expense = (
                        part.output as {
                          expense: {
                            id: string;
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
                          isOutdated={outdatedIds.has(expense.id)}
                          onEdit={handleTransactionEdit}
                          onDelete={handleTransactionDelete}
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
                            id: string;
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
                          isOutdated={outdatedIds.has(income.id)}
                          onEdit={handleIncomeEdit}
                          onDelete={handleIncomeDelete}
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

                  if (part.type === "tool-searchTransactions") {
                    if (part.state === "output-available" && part.output) {
                      return null;
                    }

                    if (
                      part.state === "input-streaming" ||
                      part.state === "input-available"
                    ) {
                      return (
                        <ToolLoading
                          key={`${message.id}-${index}`}
                          type="thinking"
                        />
                      );
                    }
                  }

                  if (part.type === "tool-deleteTransaction") {
                    if (part.state === "output-available" && part.output) {
                      const output = part.output as {
                        success: boolean;
                        deleted?: {
                          id: string;
                          item: string;
                          amount: number;
                          type: string;
                        };
                      };
                      if (output.success && output.deleted) {
                        if (!outdatedIds.has(output.deleted.id)) {
                          setOutdatedIds((prev) =>
                            new Set(prev).add(output.deleted!.id),
                          );
                        }
                        return (
                          <DeletedCard
                            key={`${message.id}-${index}`}
                            type={output.deleted.type as "expense" | "income"}
                            item={output.deleted.item}
                            amount={output.deleted.amount}
                          />
                        );
                      }
                      return null;
                    }

                    if (
                      part.state === "input-streaming" ||
                      part.state === "input-available"
                    ) {
                      return (
                        <ToolLoading
                          key={`${message.id}-${index}`}
                          type="thinking"
                        />
                      );
                    }
                  }

                  if (part.type === "tool-updateTransaction") {
                    if (part.state === "output-available" && part.output) {
                      const output = part.output as {
                        success: boolean;
                        transaction?: {
                          id: string;
                          item: string;
                          amount: number;
                          category: string;
                          subcategory?: string;
                          type: string;
                        };
                      };
                      if (output.success && output.transaction) {
                        if (!outdatedIds.has(output.transaction.id)) {
                          setOutdatedIds((prev) =>
                            new Set(prev).add(output.transaction!.id),
                          );
                        }
                        const txType = output.transaction.type as
                          | "expense"
                          | "income";
                        const editHandler =
                          txType === "expense"
                            ? handleTransactionEdit
                            : handleIncomeEdit;
                        const deleteHandler =
                          txType === "expense"
                            ? handleTransactionDelete
                            : handleIncomeDelete;
                        return (
                          <UpdatedCard
                            key={`${message.id}-${index}`}
                            id={output.transaction.id}
                            type={txType}
                            item={output.transaction.item}
                            amount={output.transaction.amount}
                            category={output.transaction.category}
                            subcategory={output.transaction.subcategory}
                            onEdit={editHandler}
                            onDelete={deleteHandler}
                          />
                        );
                      }
                      return null;
                    }

                    if (
                      part.state === "input-streaming" ||
                      part.state === "input-available"
                    ) {
                      return (
                        <ToolLoading
                          key={`${message.id}-${index}`}
                          type="thinking"
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
        selectedTransaction={selectedTransaction}
        onClearTransaction={() => setSelectedTransaction(null)}
      />

      <div className="absolute top-4 right-4 z-10">
        {!isSessionLoading && user && (
          <TrialStatus
            isPremium={isPremium}
            freeTrials={freeTrials}
            onUpgradeClick={() => router.push("/premium")}
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
            <Button onClick={handleUpgradeClick}>Upgrade Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
