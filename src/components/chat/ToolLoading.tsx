import { Loader2 } from "lucide-react";

interface ToolLoadingProps {
  type: "expense" | "income" | "thinking";
}

export function ToolLoading({ type }: ToolLoadingProps) {
  const messages = {
    expense: "Saving expense...",
    income: "Saving income...",
    thinking: "Thinking...",
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Loader2 className="size-4 animate-spin" />
      <span>{messages[type]}</span>
    </div>
  );
}
