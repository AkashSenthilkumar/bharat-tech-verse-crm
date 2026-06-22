import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Interested: "bg-purple-50 text-purple-700 border-purple-200",
  "Follow-up": "bg-amber-50 text-amber-700 border-amber-200",
  "Site Visit": "bg-orange-50 text-orange-700 border-orange-200",
  Won: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Lost: "bg-rose-50 text-rose-700 border-rose-200",
  Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  Pending: "bg-blue-50 text-blue-700 border-blue-200",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_STYLES[value] ?? "bg-secondary text-secondary-foreground border-border", className)}
    >
      {value}
    </Badge>
  );
}
