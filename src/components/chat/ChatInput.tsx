"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SendHorizonal, Loader2, Mic, Square } from "lucide-react";
import { useRef, useEffect } from "react";
import {
  TransactionAttachment,
  type SelectedTransaction,
} from "./TransactionAttachment";
import { useSarvamSTT } from "@/hooks/useSarvamSTT";
import { Persona } from "@/components/ai-elements/persona";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  selectedTransaction?: SelectedTransaction | null;
  onClearTransaction?: () => void;
}

const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  selectedTransaction,
  onClearTransaction,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { status, transcript, startRecording, stopRecording, resetTranscript } =
    useSarvamSTT();

  const handleSubmit = (e: React.FormEvent) => {
    if (isMobile()) textareaRef.current?.blur();
    onSubmit(e);
  };

  const shouldAutoSubmitRef = useRef(false);

  useEffect(() => {
    if (transcript) {
      shouldAutoSubmitRef.current = true;
      onChange(transcript);
      resetTranscript();
    }
  }, [transcript]);

  useEffect(() => {
    if (shouldAutoSubmitRef.current && value.trim()) {
      shouldAutoSubmitRef.current = false;
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [value]);

  useEffect(() => {
    if (!isLoading && !isMobile()) textareaRef.current?.focus();
  }, [isLoading]);

  const isRecording = status === "recording";
  const isProcessing = status === "processing";

  const canSubmit = selectedTransaction
    ? selectedTransaction.action === "delete" || value.trim()
    : value.trim();

  const getPlaceholder = () => {
    if (isRecording) return "Listening...";
    if (isProcessing) return "Transcribing...";
    if (!selectedTransaction) return "Coffee 50  or  Salary received 55000";
    if (selectedTransaction.action === "delete") return "Send to confirm...";
    return "Change amount to 500";
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-3 pt-2 pb-3 sm:px-4 sm:pb-4">
      <div className="sm:max-w-3xl sm:mx-auto">
        {(isRecording || isProcessing) && (
          <div className="flex justify-center pb-3">
            <Persona
              state={isRecording ? "listening" : "thinking"}
              variant="glint"
              className="size-14"
            />
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden"
        >
          {selectedTransaction && onClearTransaction && (
            <div className="px-3 pt-2">
              <TransactionAttachment
                transaction={selectedTransaction}
                onRemove={onClearTransaction}
              />
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSubmit && !isLoading)
                  handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder={getPlaceholder()}
            disabled={isLoading || isRecording}
            rows={1}
            className={cn(
              "w-full px-4 pt-3 pb-2 bg-transparent resize-none overflow-hidden",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none",
              "disabled:opacity-60",
            )}
          />

          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-2">
              {(isRecording || isProcessing) && (
                <span
                  className={cn(
                    "text-xs",
                    isRecording
                      ? "text-destructive animate-pulse"
                      : "text-muted-foreground",
                  )}
                >
                  {isRecording ? "Recording..." : "Transcribing..."}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "ghost"}
                onClick={() =>
                  isRecording ? stopRecording() : startRecording()
                }
                disabled={isLoading || isProcessing}
                className={cn(
                  "h-9 w-9 rounded-xl",
                  isRecording && "animate-pulse",
                )}
              >
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isRecording ? (
                  <Square className="size-4 fill-current" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Button>

              <Button
                type="submit"
                size="icon"
                disabled={!canSubmit || isLoading}
                className="h-9 w-9 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <SendHorizonal className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
