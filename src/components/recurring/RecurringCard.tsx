import {
  CalendarClock,
  RepeatIcon,
  Pencil,
  Trash2,
  PowerOff,
  Power,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RecurringPayment } from "@/services/recurring";
import { useCurrency } from "@/hooks/useCurrency";

interface Props {
  rule: RecurringPayment;
  onEdit: (rule: RecurringPayment) => void;
  onToggle: (rule: RecurringPayment) => void;
  onDelete: (rule: RecurringPayment) => void;
}

const FREQ_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RecurringCard({ rule, onEdit, onToggle, onDelete }: Props) {
  const nextDue = formatDate(rule.nextDueDate);
  const isOverdue =
    new Date(rule.nextDueDate) < new Date() && rule.isActive;
  const { format } = useCurrency();

  return (
    <Card
      className={`border-border/60 transition-opacity ${!rule.isActive ? "opacity-60" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{rule.name}</span>
              <Badge variant="outline" className="capitalize text-xs shrink-0">
                {rule.category}
              </Badge>
              {!rule.isActive && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  Paused
                </Badge>
              )}
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="font-medium text-foreground text-base">
                {rule.type === "expense" ? "-" : "+"}{format(rule.amount)}
              </span>

              <span className="flex items-center gap-1">
                <RepeatIcon className="size-3.5" />
                {FREQ_LABELS[rule.frequency]}
              </span>

              <span
                className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : ""}`}
              >
                <CalendarClock className="size-3.5" />
                Next: {nextDue}
                {isOverdue && " (overdue)"}
              </span>
            </div>

            {rule.notes && (
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">
                {rule.notes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onEdit(rule)}
              title="Edit"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => onToggle(rule)}
              title={rule.isActive ? "Pause" : "Resume"}
            >
              {rule.isActive ? (
                <PowerOff className="size-3.5" />
              ) : (
                <Power className="size-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(rule)}
              title="Delete"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
