import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrialStatusProps {
  isPremium: boolean;
  freeTrials: number;
  onUpgradeClick?: () => void;
}

export function TrialStatus({
  isPremium,
  freeTrials,
  onUpgradeClick,
}: TrialStatusProps) {
  if (isPremium) {
    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-400"
      >
        <Crown className="size-3" />
        Premium
      </Badge>
    );
  }

  return (
    <Badge
      variant={freeTrials > 0 ? "secondary" : "destructive"}
      className={cn("gap-1 transition-colors cursor-pointer", {
        "animate-pulse": freeTrials === 1,
      })}
      onClick={onUpgradeClick}
    >
      <Sparkles className="size-3" />
      {freeTrials} / 5 Trials
    </Badge>
  );
}
