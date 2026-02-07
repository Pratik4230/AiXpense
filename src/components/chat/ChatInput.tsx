import { Button } from "@/components/ui/button";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { SUGGESTIONS } from "@/lib/constants/suggestions";
import { cn } from "@/lib/utils";
import { SendHorizonal, Loader2 } from "lucide-react";
import {
  TransactionAttachment,
  type SelectedTransaction,
} from "./TransactionAttachment";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSuggestionClick?: (suggestion: string) => void;
  isLoading: boolean;
  showSuggestions?: boolean;
  selectedTransaction?: SelectedTransaction | null;
  onClearTransaction?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onSuggestionClick,
  isLoading,
  showSuggestions = true,
  selectedTransaction,
  onClearTransaction,
}: ChatInputProps) {
  const getPlaceholder = () => {
    if (!selectedTransaction) {
      return "Type an expense... e.g., Coffee 50";
    }
    if (selectedTransaction.action === "delete") {
      return "Send to confirm deletion...";
    }
    return "Type changes... e.g., change amount to 500";
  };

  const canSubmit = selectedTransaction
    ? selectedTransaction.action === "delete" || value.trim()
    : value.trim();

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-4">
      <div className="max-w-3xl mx-auto space-y-3">
        {selectedTransaction && onClearTransaction && (
          <TransactionAttachment
            transaction={selectedTransaction}
            onRemove={onClearTransaction}
          />
        )}

        {showSuggestions && !selectedTransaction && (
          <Suggestions>
            {SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={onSuggestionClick}
                disabled={isLoading}
              />
            ))}
          </Suggestions>
        )}
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={isLoading}
            className={cn(
              "flex-1 h-12 px-4 rounded-xl border border-border bg-background",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "disabled:opacity-50",
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit || isLoading}
            className="h-12 px-6 rounded-xl"
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
