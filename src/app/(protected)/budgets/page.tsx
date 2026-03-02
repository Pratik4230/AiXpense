"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BudgetCard, BudgetDialog } from "@/components/budget";
import { useBudgets } from "@/services/budgets";

export default function BudgetsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: budgets, isLoading } = useBudgets();

  const existingCategories = budgets?.map((b) => b.category) ?? [];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-5 sm:py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/aixpense">
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold">Budgets</h1>
            <p className="text-sm text-muted-foreground">
              Monthly spending limits per category
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)} className="shrink-0">
          <Plus className="size-4" />
          <span className="hidden sm:inline ml-1.5">Add budget</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : budgets && budgets.length > 0 ? (
        <div className="space-y-3">
          {budgets.map((budget) => (
            <BudgetCard key={budget._id} budget={budget} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <p className="text-muted-foreground text-sm">No budgets set yet.</p>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4 mr-1.5" />
            Create your first budget
          </Button>
        </div>
      )}

      <BudgetDialog
        key={addOpen ? "add" : "closed"}
        open={addOpen}
        onOpenChange={setAddOpen}
        disabledCategories={existingCategories}
      />
    </div>
  );
}
