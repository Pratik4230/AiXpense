"use client";

import { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/constants/expense";
import type { TransactionFilters } from "@/services/transactions";

interface Props {
  draft: TransactionFilters;
  applied: TransactionFilters;
  onDraftChange: (f: Partial<TransactionFilters>) => void;
  onSearch: () => void;
  onClear: () => void;
  total: number;
}

export function FiltersBar({
  draft,
  applied,
  onDraftChange,
  onSearch,
  onClear,
  total,
}: Props) {
  const [catOpen, setCatOpen] = useState(false);

  function toggleCategory(cat: string) {
    const next = draft.categories.includes(cat)
      ? draft.categories.filter((c) => c !== cat)
      : [...draft.categories, cat];
    onDraftChange({ categories: next });
  }

  const hasActive =
    applied.type !== "all" ||
    applied.categories.length > 0 ||
    applied.from ||
    applied.to ||
    applied.minAmount ||
    applied.maxAmount;

  return (
    <div className="space-y-3">
      <div className="flex items-center flex-wrap gap-2">
        <Select
          value={draft.type}
          onValueChange={(v) => onDraftChange({ type: v })}
        >
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={catOpen} onOpenChange={setCatOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              {draft.categories.length > 0
                ? `${draft.categories.length} categories`
                : "Category"}
              <ChevronDown className="size-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="grid grid-cols-2 gap-1 max-h-52 overflow-y-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs px-2 py-1.5 rounded-md text-left capitalize transition-colors ${
                    draft.categories.includes(cat)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Input
          type="date"
          value={draft.from}
          onChange={(e) => onDraftChange({ from: e.target.value })}
          className="w-36 h-8 text-xs"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="date"
          value={draft.to}
          onChange={(e) => onDraftChange({ to: e.target.value })}
          className="w-36 h-8 text-xs"
        />

        <Input
          type="number"
          placeholder="Min ₹"
          value={draft.minAmount}
          onChange={(e) => onDraftChange({ minAmount: e.target.value })}
          className="w-24 h-8 text-xs"
        />
        <Input
          type="number"
          placeholder="Max ₹"
          value={draft.maxAmount}
          onChange={(e) => onDraftChange({ maxAmount: e.target.value })}
          className="w-24 h-8 text-xs"
        />

        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onSearch}>
          <Search className="size-3" />
          Search
        </Button>

        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={onClear}
          >
            <X className="size-3 mr-1" /> Clear
          </Button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          {total} transactions
        </span>
      </div>

      {applied.categories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {applied.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs capitalize">
              {cat}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
