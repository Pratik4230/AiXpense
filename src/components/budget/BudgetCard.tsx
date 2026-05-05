"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { BudgetSummary } from "@/services/budgets";
import { useDeleteBudget } from "@/services/budgets";
import { BudgetDialog } from "./BudgetDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";

interface Props {
  budget: BudgetSummary;
}

export function BudgetCard({ budget }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteMutation = useDeleteBudget();
  const { format } = useCurrency();

  const raw = (budget.spent / budget.amount) * 100;
  const percent = Math.min(raw, 100);
  const overBudget = budget.spent > budget.amount;
  const nearLimit = raw >= 80 && !overBudget;

  const barColor = overBudget
    ? "bg-destructive"
    : nearLimit
      ? "bg-amber-500"
      : "bg-primary";

  const handleDelete = () => {
    deleteMutation.mutate(budget._id, {
      onSuccess: () => toast.success("Budget removed"),
      onError: () => toast.error("Failed to remove budget"),
    });
  };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="capitalize font-medium">{budget.category}</span>
          {overBudget && (
            <Badge variant="destructive" className="text-xs">
              Over budget
            </Badge>
          )}
          {nearLimit && (
            <Badge className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Near limit
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete budget?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the monthly budget for {budget.category}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{format(budget.spent)} spent</span>
          <span>{format(budget.amount)} limit</span>
        </div>
      </div>

      <BudgetDialog
        key={editOpen ? budget._id : "closed"}
        open={editOpen}
        onOpenChange={setEditOpen}
        existing={budget}
      />
    </div>
  );
}
