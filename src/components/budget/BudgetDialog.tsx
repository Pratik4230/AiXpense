"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CATEGORIES, type Category } from "@/constants/expense";
import {
  useCreateBudget,
  useUpdateBudget,
  type BudgetSummary,
} from "@/services/budgets";
import { useAppForm } from "./form-context";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing?: BudgetSummary;
  disabledCategories?: string[];
}

export function BudgetDialog({
  open,
  onOpenChange,
  existing,
  disabledCategories = [],
}: Props) {
  const isEdit = !!existing;
  const { code: profileCurrencyCode } = useCurrency();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useAppForm({
    defaultValues: {
      category: (existing?.category ?? CATEGORIES[0]) as Category,
      amount: existing?.amount ?? 0,
    },
    onSubmit: ({ value }) => {
      if (isEdit) {
        updateMutation.mutate(
          { id: existing!._id, amount: value.amount },
          {
            onSuccess: () => {
              toast.success("Budget updated");
              onOpenChange(false);
            },
            onError: () => toast.error("Failed to update budget"),
          },
        );
      } else {
        createMutation.mutate(value, {
          onSuccess: () => {
            toast.success("Budget created");
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to create budget"),
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit budget" : "Add budget"}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit
              ? "Update the monthly spending limit for this category."
              : "Set a monthly spending limit for a category."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {!isEdit && (
            <form.Field
              name="category"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Category is required" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="budget-category">Category</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as Category)}
                  >
                    <SelectTrigger id="budget-category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {CATEGORIES.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          disabled={disabledCategories.includes(c)}
                        >
                          <span className="capitalize">{c}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          )}

          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                !value || value <= 0 ? "Enter a positive amount" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="budget-amount">
                  Monthly limit (
                  {isEdit && existing ? existing.currency : profileCurrencyCode})
                </Label>
                <Input
                  id="budget-amount"
                  type="number"
                  min={1}
                  placeholder="e.g. 5000"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
