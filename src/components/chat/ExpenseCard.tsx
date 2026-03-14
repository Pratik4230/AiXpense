"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

interface ExpenseCardProps {
  id?: string;
  item: string;
  amount: number;
  category: string;
  subcategory?: string;
  tags?: string[];
  notes?: string;
  isOutdated?: boolean;
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

export function ExpenseCard({
  id,
  item,
  amount,
  category,
  subcategory,
  tags,
  notes,
  isOutdated,
  onEdit,
  onDelete,
}: ExpenseCardProps) {
  const categoryDisplay = subcategory
    ? `${category} / ${subcategory}`
    : category;

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
    <Card
      className={`w-full sm:min-w-72 md:min-w-sm sm:max-w-sm group ${
        isOutdated
          ? "bg-muted/50 border-muted opacity-60"
          : "bg-green-500/10 border-green-500/20"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`size-5 ${isOutdated ? "text-muted-foreground" : "text-green-500"}`}
            />
            <span
              className={`font-medium ${isOutdated ? "text-muted-foreground line-through" : "text-green-500"}`}
            >
              {isOutdated ? "Outdated" : "Expense Saved"}
            </span>
          </div>
          {id && !isOutdated && (onEdit || onDelete) && (
            <div className="flex items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
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
            <span className="text-muted-foreground">Item</span>
            <span className="font-medium">{item}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium text-foreground">
              ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Category</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {categoryDisplay}
            </Badge>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tags</span>
              <div className="flex gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {notes && (
            <div className="flex flex-col gap-1 mt-2 p-2 bg-background/50 rounded-md border border-border/50">
              <span className="text-muted-foreground text-xs">Notes / Breakdown</span>
              <span className="text-xs text-foreground/90 leading-relaxed italic">
                {notes}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
