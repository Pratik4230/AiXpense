import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SendHorizonal, Loader2, MicOff, Mic } from "lucide-react";
import { useRef, useEffect } from "react";
import {
  TransactionAttachment,
  type SelectedTransaction,
} from "./TransactionAttachment";
import { useSarvamSTT } from "@/hooks/useSarvamSTT";

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
    if (isMobile()) {
      textareaRef.current?.blur();
    }
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
    if (!isLoading && !isMobile()) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  const handleMicClick = () => {
    if (status === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getPlaceholder = () => {
    if (!selectedTransaction) return "Coffee 50";
    if (selectedTransaction.action === "delete") return "Send to confirm...";
    return "Change amount to 500";
  };

  const canSubmit = selectedTransaction
    ? selectedTransaction.action === "delete" || value.trim()
    : value.trim();

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-3 py-3 sm:px-4 sm:py-4">
      <div className="sm:max-w-3xl sm:mx-auto space-y-3">
        {selectedTransaction && onClearTransaction && (
          <TransactionAttachment
            transaction={selectedTransaction}
            onRemove={onClearTransaction}
          />
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
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
                if (canSubmit && !isLoading) {
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }
            }}
            placeholder={getPlaceholder()}
            disabled={isLoading}
            rows={1}
            className={cn(
              "flex-1 min-h-12 max-h-30 px-3 sm:px-4 py-3 rounded-xl border border-border bg-background resize-none overflow-hidden",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "disabled:opacity-50",
            )}
          />

          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={handleMicClick}
            disabled={isLoading || status === "processing"}
            className="h-12 w-12 rounded-xl shrink-0"
          >
            {status === "recording" ? (
              <MicOff className="size-5 text-red-500" />
            ) : status === "processing" ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Mic className="size-5" />
            )}
          </Button>

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit || isLoading}
            className="h-12 px-6 rounded-xl shrink-0"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <SendHorizonal className="size-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
