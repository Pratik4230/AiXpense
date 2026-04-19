import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecurringList } from "@/components/recurring/RecurringList";

export default function RecurringPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-5 sm:py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/reports">
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Recurring Payments</h1>
          <p className="text-sm text-muted-foreground">
            Auto-tracked repeating expenses and income
          </p>
        </div>
      </div>

      <RecurringList />
    </div>
  );
}
