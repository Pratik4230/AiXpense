"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface DeletedCardProps {
  type: "expense" | "income";
  item: string;
  amount: number;
  currency?: string;
}

export function DeletedCard({ type, item, amount, currency }: DeletedCardProps) {
  const isExpense = type === "expense";
  const { format } = useCurrency();

  return (
    <Card className="w-full sm:min-w-72 md:min-w-sm sm:max-w-sm bg-red-500/10 border-red-500/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="size-5 text-red-500" />
          <span className="font-medium text-red-500">
            {isExpense ? "Expense" : "Income"} Deleted
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {isExpense ? "Item" : "Source"}
            </span>
            <span className="font-medium line-through text-muted-foreground">
              {item}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium line-through text-muted-foreground">
              {format(amount, currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
