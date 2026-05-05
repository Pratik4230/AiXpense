"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Pencil, Trash2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

export interface SelectedTransaction {
  id: string;
  type: "expense" | "income";
  item: string;
  amount: number;
  category: string;
  action: "delete" | "edit";
}

interface TransactionAttachmentProps {
  transaction: SelectedTransaction;
  onRemove: () => void;
}

export function TransactionAttachment({
  transaction,
  onRemove,
}: TransactionAttachmentProps) {
  const { format } = useCurrency();
  const isDelete = transaction.action === "delete";

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isDelete
          ? "bg-red-500/10 border-red-500/30"
          : "bg-blue-500/10 border-blue-500/30"
      }`}
    >
      <div
        className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
          isDelete ? "bg-red-500/20" : "bg-blue-500/20"
        }`}
      >
        {isDelete ? (
          <Trash2 className="size-4 text-red-500" />
        ) : (
          <Pencil className="size-4 text-blue-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{transaction.item}</span>
          <Badge
            variant="outline"
            className={`shrink-0 text-xs ${
              isDelete
                ? "border-red-500/50 text-red-500"
                : "border-blue-500/50 text-blue-500"
            }`}
          >
            {isDelete ? "Delete" : "Edit"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center">
            {format(transaction.amount)}
          </span>
          <span>-</span>
          <span className="capitalize">{transaction.category}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        onClick={onRemove}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
