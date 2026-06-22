import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down";
}) {
  return (
    <Card className="card-hover relative border-l-2 border-l-primary overflow-hidden">
      <div className="gold-underline absolute inset-x-0 top-0 h-px" />
      <CardContent className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trendDirection === "up" ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trendDirection === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend}
            </p>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/25">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
