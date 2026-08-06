"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SendHorizonal,
  Loader2,
  Mic,
  Camera,
  ScanLine,
  Lock,
} from "lucide-react";
import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Link from "next/link";
import {
  TransactionAttachment,
  type SelectedTransaction,
} from "./TransactionAttachment";
import { useSarvamSTT } from "@/hooks/useSarvamSTT";
import { Persona } from "@/components/ai-elements/persona";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ChatInputHandle = {
  openFilePicker: () => void;
};

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (
    e: React.FormEvent,
    attachedFiles?: { url: string; mediaType: string }[],
  ) => void;
  isLoading: boolean;
  isPremium: boolean;
  selectedTransaction?: SelectedTransaction | null;
  onClearTransaction?: () => void;
}

const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

const MAX_INPUT_CHARS = 2000;


export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput(
    {
      value,
      onChange,
      onSubmit,
      isLoading,
      isPremium,
      selectedTransaction,
      onClearTransaction,
    },
    ref,
  ) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => fileInputRef.current?.click(),
  }));

  const { status, transcript, secondsLeft, startRecording, stopRecording, resetTranscript } =
    useSarvamSTT();

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const oversized = file.size > 10 * 1024 * 1024;
    if (oversized) {
      toast.error(`"${file.name}" exceeds the 10 MB limit`);
      return;
    }

    setIsUploadingFile(true);
    setUploadError(false);

    try {
      const res = await fetch("/api/imagekit-auth");
      if (!res.ok) throw new Error("Failed to get auth");
      const authParams = await res.json();

      const { upload } = await import("@imagekit/next");
      const uploadRes = await upload({
        file,
        fileName: file.name,
        folder: "/receipts",
        ...authParams,
      });

      // Instantly submit the newly uploaded file URL to the chat
      onSubmit({ preventDefault: () => {} } as React.FormEvent, [
        { url: uploadRes.url as string, mediaType: file.type },
      ]);
    } catch {
      setUploadError(true);
      toast.error("File upload failed. Please try again.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const isRecording = status === "recording";
  const isProcessing = status === "processing";

  const isBusy = isLoading || isRecording || isUploadingFile;

  const canSubmit = selectedTransaction
    ? selectedTransaction.action === "delete" || value.trim()
    : value.trim();

  const charsRemaining = MAX_INPUT_CHARS - value.length;
  const showCharCount = value.length > 1800;


  const getPlaceholder = () => {
    if (isUploadingFile) return "Uploading bill...";
    if (uploadError) return "Upload failed. Try again or type manually";
    if (isRecording) return "Listening...";
    if (isProcessing) return "Transcribing...";
    if (!selectedTransaction) return "Coffee 50  or  Salary received 55000";
    if (selectedTransaction.action === "delete") return "Send to confirm...";
    return "Change amount to 500";
  };

  return (
    <div className="border-t border-border bg-background px-3 pt-2 pb-3 sm:px-4 sm:pb-4">
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

        {isUploadingFile && (
          <div className="flex justify-center pb-3">
            <Persona state="thinking" variant="glint" className="size-14" />
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
              const next = e.target.value.slice(0, MAX_INPUT_CHARS);
              onChange(next);
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
            disabled={isBusy}
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
              {isPremium ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,application/pdf"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    className={cn(
                      "h-9 w-9 rounded-xl",
                      isUploadingFile && "animate-pulse text-primary",
                      uploadError && "text-destructive",
                    )}
                    title="Scan bill"
                  >
                    {isUploadingFile ? (
                      <ScanLine className="size-4 animate-pulse" />
                    ) : (
                      <Camera className="size-4" />
                    )}
                  </Button>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/premium">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl relative text-muted-foreground"
                      >
                        <Camera className="size-4" />
                        <Lock className="absolute -bottom-0.5 -right-0.5 size-2.5 text-amber-500" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Bill scan is a Premium feature
                  </TooltipContent>
                </Tooltip>
              )}

              {(isRecording || isProcessing || isUploadingFile) && (
                <span
                  className={cn(
                    "text-xs",
                    isRecording
                      ? "text-destructive animate-pulse"
                      : "text-muted-foreground",
                  )}
                >
                  {isRecording
                    ? "Recording..."
                    : isUploadingFile
                      ? "Uploading..."
                      : "Transcribing..."}
                </span>
              )}
              {showCharCount && !isRecording && !isProcessing && !isUploadingFile && (
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    charsRemaining <= 100 ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {charsRemaining}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "ghost" : "ghost"}
                onClick={() =>
                  isRecording ? stopRecording() : startRecording()
                }
                disabled={isLoading || isProcessing || isUploadingFile}
                className={cn(
                  "relative h-9 w-9 rounded-xl overflow-hidden",
                  isRecording && "hover:bg-transparent",
                )}
              >
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isRecording ? (
                  <span
                    aria-live="polite"
                    aria-label={`${secondsLeft} seconds remaining`}
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-500/12 text-[13px] font-semibold tabular-nums text-red-500"
                  >
                    {secondsLeft}
                  </span>
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
},
);
