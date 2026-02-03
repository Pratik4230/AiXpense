"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  IndianRupee,
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants/expense";
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/services/transactions";

interface Transaction {
  _id: string;
  type: "expense" | "income";
  item: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    item: transaction.item,
    amount: transaction.amount,
    category: transaction.category,
    subcategory: transaction.subcategory || "",
  });

  const deleteMutation = useDeleteTransaction();
  const updateMutation = useUpdateTransaction();

  const categories =
    transaction.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleDelete = () => {
    deleteMutation.mutate(transaction._id);
  };

  const handleEdit = () => {
    updateMutation.mutate(
      {
        id: transaction._id,
        data: {
          item: editData.item,
          amount: editData.amount,
          category: editData.category,
          subcategory: editData.subcategory || undefined,
        },
      },
      {
        onSuccess: () => setEditOpen(false),
      },
    );
  };

  const isPending = deleteMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 group">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div
            className={`size-8 sm:size-10 shrink-0 rounded-full flex items-center justify-center ${
              transaction.type === "expense"
                ? "bg-red-500/10"
                : "bg-green-500/10"
            }`}
          >
            {transaction.type === "expense" ? (
              <ArrowUpRight className="size-4 sm:size-5 text-red-500" />
            ) : (
              <ArrowDownLeft className="size-4 sm:size-5 text-green-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm sm:text-base truncate">
              {transaction.item}
            </div>
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
              <Badge variant="secondary" className="text-xs">
                {transaction.category}
              </Badge>
              {transaction.subcategory && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {transaction.subcategory}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div
            className={`text-sm sm:text-lg font-semibold flex items-center ${
              transaction.type === "expense" ? "text-red-500" : "text-green-500"
            }`}
          >
            {transaction.type === "expense" ? "-" : "+"}
            <IndianRupee className="size-3 sm:size-4" />
            {transaction.amount.toLocaleString("en-IN")}
          </div>

          <div className="flex items-center gap-1 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete {transaction.item} for ₹
                    {transaction.amount.toLocaleString("en-IN")}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Item</Label>
              <Input
                value={editData.item}
                onChange={(e) =>
                  setEditData({ ...editData, item: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={editData.category}
                onValueChange={(value) =>
                  setEditData({ ...editData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subcategory (optional)</Label>
              <Input
                value={editData.subcategory}
                onChange={(e) =>
                  setEditData({ ...editData, subcategory: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
