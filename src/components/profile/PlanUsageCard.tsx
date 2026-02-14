import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";

interface PlanUsageCardProps {
  isPremium: boolean;
  freeTrials: number;
}

export function PlanUsageCard({ isPremium, freeTrials }: PlanUsageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Plan & Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Plan</span>
          <Badge
            variant={isPremium ? "default" : "secondary"}
            className="gap-1"
          >
            {isPremium ? (
              <>
                <Crown className="size-3" />
                Premium
              </>
            ) : (
              "Free"
            )}
          </Badge>
        </div>

        {!isPremium && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Free trials remaining
              </span>
              <span className="text-sm font-medium">{freeTrials}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${(freeTrials / 5) * 100}%` }}
              />
            </div>
            <Link href="/premium">
              <Button className="w-full gap-2" variant="outline">
                <Sparkles className="size-4" />
                Upgrade to Premium
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
