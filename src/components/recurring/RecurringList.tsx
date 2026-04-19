"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RecurringCard } from "./RecurringCard";
import { RecurringFormDialog } from "./RecurringFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useRecurringPayments,
  useCreateRecurringPayment,
  useUpdateRecurringPayment,
  useDeleteRecurringPayment,
  type RecurringPayment,
  type CreateRecurringPaymentInput,
} from "@/services/recurring";
import { toast } from "sonner";

export function RecurringList() {
  const [showAll, setShowAll] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RecurringPayment | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<RecurringPayment | undefined>();

  const { data, isLoading } = useRecurringPayments(!showAll ? true : false);
  const create = useCreateRecurringPayment();
  const update = useUpdateRecurringPayment();
  const remove = useDeleteRecurringPayment();

  const rules = data?.data ?? [];

  const handleCreate = (values: CreateRecurringPaymentInput) => {
    create.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
        toast.success("Recurring payment created");
      },
      onError: () => toast.error("Failed to create recurring payment"),
    });
  };

  const handleEdit = (values: CreateRecurringPaymentInput) => {
    if (!editTarget) return;
    update.mutate(
      { id: editTarget._id, ...values },
      {
        onSuccess: () => {
          setEditTarget(undefined);
          toast.success("Updated");
        },
        onError: () => toast.error("Failed to update"),
      },
    );
  };

  const handleToggle = (rule: RecurringPayment) => {
    update.mutate(
      { id: rule._id, isActive: !rule.isActive },
      {
        onSuccess: () =>
          toast.success(rule.isActive ? "Paused" : "Resumed"),
        onError: () => toast.error("Failed to update"),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget._id, {
      onSuccess: () => {
        setDeleteTarget(undefined);
        toast.success("Deleted");
      },
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            {showAll ? "All rules" : "Active rules"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowAll((p) => !p)}
          >
            {showAll ? "Show active only" : "Show all"}
          </Button>
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="size-4 mr-1" />
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No recurring payments yet.</p>
          <p className="text-xs mt-1">Add one to auto-track repeating expenses or income.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <RecurringCard
              key={rule._id}
              rule={rule}
              onEdit={(r) => setEditTarget(r)}
              onToggle={handleToggle}
              onDelete={(r) => setDeleteTarget(r)}
            />
          ))}
        </div>
      )}

      <RecurringFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
        isPending={create.isPending}
      />

      <RecurringFormDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(undefined)}
        onSubmit={handleEdit}
        isPending={update.isPending}
        defaultValues={editTarget}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete recurring payment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the rule. Past transactions already created will
              not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
