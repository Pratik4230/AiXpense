"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IndianRupee, Filter, Loader2, RefreshCw } from "lucide-react";
import { CATEGORIES } from "@/lib/constants/expense";
import { TransactionCard } from "@/components/expenses";
import { useTransactions } from "@/services/transactions";

export default function ExpensesPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("month");

  const { data, isLoading, refetch } = useTransactions({
    type: typeFilter,
    category: categoryFilter,
    period: periodFilter,
  });

  const transactions = data?.transactions || [];

  const categories = CATEGORIES;

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const groupedByDate = transactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {} as Record<string, typeof transactions>,
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Transactions</h1>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Spent
              </div>
              <div className="text-lg sm:text-xl font-bold text-red-500 flex items-center">
                <IndianRupee className="size-3 sm:size-4" />
                {totalExpense.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Earned
              </div>
              <div className="text-lg sm:text-xl font-bold text-green-500 flex items-center">
                <IndianRupee className="size-3 sm:size-4" />
                {totalIncome.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Balance
              </div>
              <div
                className={`text-lg sm:text-xl font-bold flex items-center ${totalIncome - totalExpense >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                <IndianRupee className="size-3 sm:size-4" />
                {Math.abs(totalIncome - totalExpense).toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="size-4" />
                Filters
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {[...new Set(categories)].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No transactions found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {date}
                </h3>
                <Card>
                  <CardContent className="p-0 divide-y">
                    {items.map((transaction) => (
                      <TransactionCard
                        key={transaction._id}
                        transaction={transaction}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
