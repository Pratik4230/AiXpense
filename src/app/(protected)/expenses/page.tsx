export default function ExpensesPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground">Your expenses will appear here.</p>
      </div>
    </div>
  );
}
