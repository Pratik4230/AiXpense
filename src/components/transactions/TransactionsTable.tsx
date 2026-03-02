"use client";

import { useCallback } from "react";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { TransactionFilters } from "@/services/transactions";
import type { TransactionsPage } from "@/services/transactions";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface SortHeaderProps {
  label: string;
  field: string;
  filters: TransactionFilters;
  onChange: (f: Partial<TransactionFilters>) => void;
}

function SortHeader({ label, field, filters, onChange }: SortHeaderProps) {
  const active = filters.sort === field;
  function toggle() {
    if (active) {
      onChange({ order: filters.order === "asc" ? "desc" : "asc" });
    } else {
      onChange({ sort: field, order: "desc" });
    }
  }
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      <span className="text-muted-foreground/50">
        {active ? (
          filters.order === "asc" ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )
        ) : (
          <ChevronDown className="size-3 opacity-30" />
        )}
      </span>
    </button>
  );
}

interface Props {
  pages: TransactionsPage[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  filters: TransactionFilters;
  onFilterChange: (f: Partial<TransactionFilters>) => void;
}

export function TransactionsTable({
  pages,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  filters,
  onFilterChange,
}: Props) {
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(onIntersect, hasNextPage);

  const rows = pages.flatMap((p) => p.data);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-sm text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs text-muted-foreground w-24 sm:w-28">
              <SortHeader
                label="Date"
                field="date"
                filters={filters}
                onChange={onFilterChange}
              />
            </TableHead>
            <TableHead className="text-xs text-muted-foreground">
              Item
            </TableHead>
            <TableHead className="text-xs text-muted-foreground">
              <SortHeader
                label="Category"
                field="category"
                filters={filters}
                onChange={onFilterChange}
              />
            </TableHead>
            <TableHead className="text-xs text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-xs text-muted-foreground text-right">
              <SortHeader
                label="Amount"
                field="amount"
                filters={filters}
                onChange={onFilterChange}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((tx) => (
            <TableRow key={tx._id}>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(tx.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-sm font-medium max-w-32 sm:max-w-48 truncate">
                {tx.item}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="text-xs capitalize font-normal"
                >
                  {tx.category}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs font-medium capitalize px-1.5 py-0.5 rounded ${
                    tx.type === "expense"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  {tx.type}
                </span>
              </TableCell>
              <TableCell
                className={`text-sm font-semibold text-right ${
                  tx.type === "expense" ? "text-red-500" : "text-emerald-500"
                }`}
              >
                {tx.type === "expense" ? "-" : "+"}
                {fmt(tx.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div ref={sentinelRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
