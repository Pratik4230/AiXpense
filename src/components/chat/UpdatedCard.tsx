"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, IndianRupee, Pencil, Trash2 } from "lucide-react";

interface UpdatedCardProps {
  id?: string;
  type: "expense" | "income";
  item: string;
  amount: number;
  category: string;
  subcategory?: string;
  onEdit?: (data: {
    id: string;
    item: string;
    amount: number;
    category: string;
  }) => void;
  onDelete?: (data: {
    id: string;
    item: string;
    amount: number;
    category: string;
  }) => void;
}

export function UpdatedCard({
  id,
  type,
  item,
  amount,
  category,
  subcategory,
  onEdit,
  onDelete,
}: UpdatedCardProps) {
  const categoryDisplay = subcategory
    ? `${category} / ${subcategory}`
    : category;

  const isExpense = type === "expense";

  const handleEdit = () => {
    if (id && onEdit) {
      onEdit({ id, item, amount, category });
    }
  };

  const handleDelete = () => {
    if (id && onDelete) {
      onDelete({ id, item, amount, category });
    }
  };

  return (
    <Card className="w-full sm:min-w-72 md:min-w-sm sm:max-w-sm bg-amber-500/10 border-amber-500/20 group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="size-5 text-amber-500" />
            <span className="font-medium text-amber-500">
              {isExpense ? "Expense" : "Income"} Updated
            </span>
          </div>
          {id && (onEdit || onDelete) && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleEdit}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {isExpense ? "Item" : "Source"}
            </span>
            <span className="font-medium">{item}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium flex items-center">
              {!isExpense && "+"}
              <IndianRupee className="size-3" />
              {amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Category</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {categoryDisplay}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
