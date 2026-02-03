import { Sparkles } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="size-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Welcome to AiXpense</h1>
      <p className="text-muted-foreground max-w-md">
        Track your money by just typing naturally.
      </p>
    </div>
  );
}
