import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ToolLoadingProps {
  type: "expense" | "income" | "thinking";
}

export function ToolLoading({ type }: ToolLoadingProps) {
  if (type === "thinking") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="size-4 animate-spin" />
        <span>Processing...</span>
      </div>
    );
  }

  const isExpense = type === "expense";

  return (
    <Card
      className={`w-full sm:min-w-72 md:min-w-sm sm:max-w-sm ${
        isExpense
          ? "bg-green-500/10 border-green-500/20"
          : "bg-blue-500/10 border-blue-500/20"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Loader2
            className={`size-5 animate-spin ${
              isExpense ? "text-green-500" : "text-blue-500"
            }`}
          />
          <span
            className={`font-medium ${
              isExpense ? "text-green-500" : "text-blue-500"
            }`}
          >
            {isExpense ? "Saving Expense..." : "Saving Income..."}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {isExpense ? "Item" : "Source"}
            </span>
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Category</span>
            <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
