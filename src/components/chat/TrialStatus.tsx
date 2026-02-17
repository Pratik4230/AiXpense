import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
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
    return null;
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
      <span className="hidden sm:inline">{freeTrials} / 5 Trials</span>
      <span className="sm:hidden">{freeTrials}/5</span>
    </Badge>
  );
}
