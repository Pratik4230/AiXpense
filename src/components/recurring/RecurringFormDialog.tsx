"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, EXPENSE_TYPES, FREQUENCIES } from "@/constants/expense";
import type { RecurringPayment, CreateRecurringPaymentInput } from "@/services/recurring";
import { useAppForm } from "./form-context";
import { useCurrency } from "@/hooks/useCurrency";
import { useUtcCalendarDateFormat } from "@/hooks/useUtcCalendarDateFormat";
import { formatUtcWeekdayLong } from "@/lib/utcDates";

function toDateInput(iso?: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return new Date(iso).toISOString().slice(0, 10);
}

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateRecurringPaymentInput) => void;
  isPending: boolean;
  defaultValues?: RecurringPayment;
}

export function RecurringFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  defaultValues,
}: Props) {
  const isEdit = !!defaultValues;
  const { symbol } = useCurrency();
  const { locale } = useUtcCalendarDateFormat();

  const form = useAppForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      amount: defaultValues?.amount ?? 0,
      category: defaultValues?.category ?? "bills",
      type: defaultValues?.type ?? "expense",
      frequency: defaultValues?.frequency ?? "monthly",
      recurOnDate: defaultValues?.recurOnDate ?? 1,
      startDate: toDateInput(defaultValues?.startDate),
      notes: defaultValues?.notes ?? "",
    } as {
      name: string;
      amount: number;
      category: (typeof CATEGORIES)[number];
      type: (typeof EXPENSE_TYPES)[number];
      frequency: (typeof FREQUENCIES)[number];
      recurOnDate: number;
      startDate: string;
      notes: string;
    },
    onSubmit: ({ value }) => {
      onSubmit({
        name: value.name,
        amount: value.amount,
        category: value.category,
        type: value.type,
        frequency: value.frequency,
        recurOnDate: value.frequency === "monthly" ? value.recurOnDate : undefined,
        startDate: value.startDate,
        notes: value.notes || undefined,
      });
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: defaultValues?.name ?? "",
      amount: defaultValues?.amount ?? 0,
      category: defaultValues?.category ?? "bills",
      type: defaultValues?.type ?? "expense",
      frequency: defaultValues?.frequency ?? "monthly",
      recurOnDate: defaultValues?.recurOnDate ?? 1,
      startDate: toDateInput(defaultValues?.startDate),
      notes: defaultValues?.notes ?? "",
    });
  }, [open, defaultValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Recurring Payment" : "New Recurring Payment"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? "Update this recurring rule." : "Create a new recurring payment rule."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{ onChange: ({ value }) => !value.trim() ? "Name is required" : undefined }}
          >
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="rp-name">Name</Label>
                <Input
                  id="rp-name"
                  placeholder="Netflix, House Rent, EMI…"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-3">
            <form.Field
              name="amount"
              validators={{ onChange: ({ value }) => value <= 0 ? "Must be positive" : undefined }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="rp-amount">Amount ({symbol})</Label>
                  <Input
                    id="rp-amount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as typeof EXPENSE_TYPES[number])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <form.Field name="category">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as typeof CATEGORIES[number])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c} className="capitalize">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="frequency">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Frequency</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v as typeof FREQUENCIES[number])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((f) => (
                        <SelectItem key={f} value={f} className="capitalize">
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe selector={(s) => s.values.frequency}>
            {(frequency) =>
              frequency === "monthly" ? (
                <form.Field name="recurOnDate">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label>Recur on day of month</Label>
                      <Select
                        value={String(field.state.value)}
                        onValueChange={(v) => field.handleChange(Number(v))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pick a day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((d) => (
                            <SelectItem key={d} value={String(d)}>
                              {d}
                              {d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Max 28, safe across all months.
                      </p>
                    </div>
                  )}
                </form.Field>
              ) : (
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <form.Field
                    name="startDate"
                    validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}
                  >
                    {(field) => (
                      <>
                        <Input
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        <p className="text-xs text-muted-foreground">
                          {frequency === "weekly"
                            ? `Recurs every ${formatUtcWeekdayLong(field.state.value, locale)}`
                            : frequency === "yearly"
                            ? `Recurs every year on this date`
                            : `Recurs daily from this date`}
                        </p>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                        )}
                      </>
                    )}
                  </form.Field>
                </div>
              )
            }
          </form.Subscribe>

          <form.Field name="notes">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="rp-notes">Notes (optional)</Label>
                <Textarea
                  id="rp-notes"
                  rows={2}
                  placeholder="Any notes…"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
