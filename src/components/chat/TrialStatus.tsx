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
    return (
      <Badge
        variant="outline"
        className="gap-1 hidden sm:flex border-amber-500/50 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors cursor-default"
      >
        <Sparkles className="size-3 fill-amber-600 text-amber-600" />
        <span className="font-medium">Premium</span>
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
      <span className="hidden sm:inline">{freeTrials} / 7 today</span>
      <span className="sm:hidden">{freeTrials}/7</span>
    </Badge>
  );
}
