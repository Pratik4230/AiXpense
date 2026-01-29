export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your expenses with AI
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">₹0</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">₹0</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">₹0</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">0</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Add</h2>
        <p className="text-muted-foreground text-sm">
          Type something like &quot;bought coffee for 50 rs&quot; to add an
          expense
        </p>
        <div className="mt-4">
          <input
            type="text"
            placeholder="e.g., lunch at office 150 rs"
            className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
}
