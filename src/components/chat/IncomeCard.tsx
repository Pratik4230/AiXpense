import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface IncomeCardProps {
  source: string;
  amount: number;
  category: string;
  subcategory?: string;
  tags?: string[];
}

export function IncomeCard({
  source,
  amount,
  category,
  subcategory,
  tags,
}: IncomeCardProps) {
  const categoryDisplay = subcategory
    ? `${category} / ${subcategory}`
    : category;

  return (
    <Card className="bg-blue-500/10 border-blue-500/20 w-full sm:min-w-72 md:min-w-sm sm:max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="size-5 text-blue-500" />
          <span className="font-medium text-blue-500">Income Saved</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Source</span>
            <span className="font-medium">{source}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium text-green-500">
              +₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Category</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {categoryDisplay}
            </Badge>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tags</span>
              <div className="flex gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
