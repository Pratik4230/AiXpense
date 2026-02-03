import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, IndianRupee } from "lucide-react";

interface IncomeCardProps {
  source: string;
  amount: number;
  category: string;
  subcategory?: string;
}

export function IncomeCard({
  source,
  amount,
  category,
  subcategory,
}: IncomeCardProps) {
  return (
    <Card className="bg-blue-500/10 border-blue-500/20 w-full sm:min-w-72 md:min-w-sm sm:max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="size-5 text-blue-500" />
          <span className="font-medium text-blue-500">Income Saved</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source</span>
            <span className="font-medium">{source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium flex items-center text-green-500">
              +<IndianRupee className="size-3" />
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
