"use client";

import { Suspense, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltersBar } from "@/components/transactions/FiltersBar";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import {
  useTransactions,
  type TransactionFilters,
} from "@/services/transactions";

const DEFAULT_FILTERS = (mode: string): TransactionFilters => ({
  type: mode,
  categories: [],
  from: "",
  to: "",
  minAmount: "",
  maxAmount: "",
  sort: "date",
  order: "desc",
});

function TransactionsContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") ?? "all";

  const [draft, setDraft] = useState<TransactionFilters>(() =>
    DEFAULT_FILTERS(initialMode),
  );
  const [applied, setApplied] = useState<TransactionFilters>(() =>
    DEFAULT_FILTERS(initialMode),
  );

  const handleDraftChange = useCallback(
    (partial: Partial<TransactionFilters>) => {
      setDraft((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const handleSearch = useCallback(() => {
    setApplied({ ...draft });
  }, [draft]);

  const handleClear = useCallback(() => {
    const reset = DEFAULT_FILTERS("all");
    setDraft(reset);
    setApplied(reset);
  }, []);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useTransactions(applied);

  const pages = data?.pages ?? [];
  const total = pages[0]?.total ?? 0;

  return (
    <Card className="border-border/60">
      <CardContent className="p-4 space-y-4">
        <FiltersBar
          draft={draft}
          applied={applied}
          onDraftChange={handleDraftChange}
          onSearch={handleSearch}
          onClear={handleClear}
          total={total}
        />
        <TransactionsTable
          pages={pages}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage ?? false}
          fetchNextPage={fetchNextPage}
          filters={applied}
          onFilterChange={(partial) => {
            const next = { ...applied, ...partial };
            setApplied(next);
            setDraft(next);
          }}
        />
      </CardContent>
    </Card>
  );
}

export default function TransactionsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-5 sm:py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/reports">
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            All your expenses and income
          </p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <TransactionsContent />
      </Suspense>
    </div>
  );
}
