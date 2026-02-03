import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, IndianRupee } from "lucide-react";

interface ExpenseCardProps {
  item: string;
  amount: number;
  category: string;
  subcategory?: string;
}

export function ExpenseCard({
  item,
  amount,
  category,
  subcategory,
}: ExpenseCardProps) {
  return (
    <Card className="bg-green-500/10 border-green-500/20 w-full sm:min-w-72 md:min-w-sm sm:max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="size-5 text-green-500" />
          <span className="font-medium text-green-500">Expense Saved</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Item</span>
            <span className="font-medium">{item}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium flex items-center text-red-500">
              -<IndianRupee className="size-3" />
              {amount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category</span>
            <Badge variant="secondary" className="text-xs">
              {category}
              {subcategory && ` / ${subcategory}`}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
