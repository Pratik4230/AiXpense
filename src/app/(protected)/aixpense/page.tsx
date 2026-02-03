"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  ExpenseCard,
  IncomeCard,
  ChatEmptyState,
  ChatInput,
  ToolLoading,
} from "@/components/chat";

export default function AiXpensePage() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    sendMessage({ text: suggestion });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && <ChatEmptyState />}

          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, index) => {
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
    </div>
  );
}
