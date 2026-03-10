"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useCallback, useRef } from "react";
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
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
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
import { toast } from "sonner";
import {
  MAX_MESSAGES_PER_CONVERSATION,
  MESSAGE_WARNING_THRESHOLDS,
} from "@/constants/conversation";
import {
  useCreateConversation,
  useUpdateConversation,
} from "@/services/conversations";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: object[];
}

interface ChatViewProps {
  conversationId: string | null;
  initialMessages: ChatMessage[];
  messageCount: number;
  isPremium: boolean;
  freeTrials: number;
  onDecrementTrials: () => void;
  onShowUpgradeDialog: () => void;
  onShowLimitDialog: () => void;
  onConversationCreated: (id: string) => void;
}

export function ChatView({
  conversationId,
  initialMessages,
  messageCount,
  isPremium,
  freeTrials,
  onDecrementTrials,
  onShowUpgradeDialog,
  onShowLimitDialog,
  onConversationCreated,
}: ChatViewProps) {
  const [input, setInput] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<SelectedTransaction | null>(null);
  const [outdatedIds, setOutdatedIds] = useState<Set<string>>(new Set());

  const conversationIdRef = useRef(conversationId);
  const pendingSaveRef = useRef(false);

  const createConversation = useCreateConversation();
  const updateConversation = useUpdateConversation();

  const saveMessages = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (currentMessages: any[]) => {
      if (currentMessages.length === 0 || pendingSaveRef.current) return;
      pendingSaveRef.current = true;

      try {
        const messagesToSave = currentMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          parts: msg.parts,
          createdAt: new Date(),
        }));

        const currentConvId = conversationIdRef.current;

        if (currentConvId) {
          await updateConversation.mutateAsync({
            id: currentConvId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages: messagesToSave as any,
          });
        } else {
          const firstUserMessage = currentMessages.find(
            (m) => m.role === "user",
          );
          let title = "New Conversation";
          if (firstUserMessage?.parts) {
            const textPart = (
              firstUserMessage.parts as { type: string; text?: string }[]
            ).find((p) => p.type === "text");
            if (textPart?.text) {
              title = textPart.text.slice(0, 50);
              if (title.includes("[ATTACHED_TRANSACTION:")) {
                const itemMatch = title.match(/item=([^,\]]+)/);
                title = itemMatch
                  ? `Transaction: ${itemMatch[1]}`
                  : "Transaction Edit";
              }
            }
          }

          const newConv = await createConversation.mutateAsync(title);
          conversationIdRef.current = newConv._id;
          onConversationCreated(newConv._id);
          await updateConversation.mutateAsync({
            id: newConv._id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages: messagesToSave as any,
          });
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Message limit reached")
        ) {
          onShowLimitDialog();
        }
      } finally {
        pendingSaveRef.current = false;
      }
    },
    [
      createConversation,
      updateConversation,
      onShowLimitDialog,
      onConversationCreated,
    ],
  );

  const {
    messages: chatMessages,
    sendMessage,
    status,
  } = useChat({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: initialMessages as any,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      if (
        error.message.includes("No free trials remaining") ||
        error.message.includes("403")
      ) {
        onShowUpgradeDialog();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const isLoading = status === "streaming";

  const shownWarningsRef = useRef<Set<number>>(new Set());

  const prevStatusRef = useRef(status);
  if (prevStatusRef.current === "streaming" && status === "ready") {
    if (
      chatMessages.length > 0 &&
      chatMessages[chatMessages.length - 1]?.role === "assistant"
    ) {
      saveMessages(chatMessages);

      const currentCount = chatMessages.length;
      for (const threshold of MESSAGE_WARNING_THRESHOLDS) {
        if (
          currentCount >= threshold &&
          !shownWarningsRef.current.has(threshold)
        ) {
          shownWarningsRef.current.add(threshold);
          const remaining = MAX_MESSAGES_PER_CONVERSATION - currentCount;
          toast.info(`${remaining} messages left in this conversation`, {
            description: "Consider starting a new chat for fresh context",
            action: {
              label: "New Chat",
              onClick: () => (window.location.href = "/aixpense"),
            },
          });
          break;
        }
      }
    }
  }
  prevStatusRef.current = status;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium && freeTrials <= 0) {
      onShowUpgradeDialog();
      return;
    }

    if (conversationId && messageCount >= MAX_MESSAGES_PER_CONVERSATION - 2) {
      onShowLimitDialog();
      return;
    }

    if (selectedTransaction) {
      const prefix = `[ATTACHED_TRANSACTION: id=${selectedTransaction.id}, type=${selectedTransaction.type}, item=${selectedTransaction.item}, amount=${selectedTransaction.amount}, action=${selectedTransaction.action}]`;
      const messageText =
        selectedTransaction.action === "delete"
          ? prefix
          : `${prefix} ${input}`.trim();

      if (selectedTransaction.action === "delete" || input.trim()) {
        onDecrementTrials();
        sendMessage({ text: messageText });
        setInput("");
        setSelectedTransaction(null);
      }
      return;
    }

    if (!input.trim() || isLoading) return;
    onDecrementTrials();
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    if (!isPremium && freeTrials <= 0) {
      onShowUpgradeDialog();
      return;
    }
    onDecrementTrials();
    sendMessage({ text: suggestion });
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

  return (
    <>
      <Conversation className="flex-1">
        <ConversationContent className="px-4 sm:px-6 max-w-3xl mx-auto w-full pt-14">
          {chatMessages.length === 0 ? (
            <ChatEmptyState
              onSuggestionClick={handleSuggestionClick}
              isLoading={isLoading}
            />
          ) : (
            chatMessages.map((message) => (
              <Message
                key={message.id}
                from={message.role === "user" ? "user" : "assistant"}
                isPremium={isPremium}
              >
                <MessageContent>
                  {message.parts?.map((part, index) => {
                    if (part.type === "reasoning") {
                      const isStreaming = part.state === "streaming";
                      const reasoningPart = part as {
                        type: "reasoning";
                        state: "streaming" | "done";
                        text?: string;
                      };
                      const reasoningText = reasoningPart.text || "";

                      return (
                        <Reasoning
                          key={`${message.id}-${index}`}
                          isStreaming={isStreaming}
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
            ))
          )}

          {isLoading &&
            chatMessages[chatMessages.length - 1]?.role === "user" && (
              <Message from="assistant">
                <MessageContent>
                  <ToolLoading type="thinking" />
                </MessageContent>
              </Message>
            )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        selectedTransaction={selectedTransaction}
        onClearTransaction={() => setSelectedTransaction(null)}
      />
    </>
  );
}
