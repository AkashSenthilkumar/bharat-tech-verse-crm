import {
  CalendarClock,
  CheckCircle2,
  MapPinned,
  PhoneCall,
  StickyNote,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/types";

function iconFor(event: TimelineEvent): { icon: LucideIcon; className: string } {
  if (event.type === "status") {
    if (event.title.toLowerCase().includes("lost")) {
      return { icon: XCircle, className: "text-rose-600 bg-rose-50 border-rose-200" };
    }
    return { icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  }
  switch (event.type) {
    case "call":
      return { icon: PhoneCall, className: "text-blue-600 bg-blue-50 border-blue-200" };
    case "followup":
      return { icon: CalendarClock, className: "text-primary bg-primary/10 border-primary/30" };
    case "site-visit":
      return { icon: MapPinned, className: "text-orange-600 bg-orange-50 border-orange-200" };
    default:
      return { icon: StickyNote, className: "text-slate-500 bg-slate-100 border-slate-200" };
  }
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative space-y-6 pl-9 before:absolute before:left-[15px] before:top-1 before:bottom-1 before:w-px before:bg-border">
      {sorted.map((event) => {
        const { icon: Icon, className } = iconFor(event);
        return (
          <div key={event.id} className="relative">
            <div
              className={cn(
                "absolute -left-9 flex h-7 w-7 items-center justify-center rounded-full border",
                className
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-medium text-foreground">{event.title}</p>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {event.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground/70 mt-1">
              {new Date(event.timestamp).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
