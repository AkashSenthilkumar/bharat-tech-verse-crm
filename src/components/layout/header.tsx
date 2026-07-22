"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  CheckCircle2,
  LogOut,
  ShieldAlert,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCrm } from "@/lib/store";
import { useRole } from "@/lib/role-store";
import { TODAY } from "@/lib/data";
import {
  MACHINES,
  VISION_ALERTS,
  INVENTORY_ITEMS,
  CUSTOMER_ORDERS,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  detail: string;
  href?: string;
}

export function Header({ title }: { title: string }) {
  const router = useRouter();
  const { followUps, siteVisits } = useCrm();
  const { roleDef } = useRole();

  const todayStr = TODAY.toISOString().slice(0, 10);
  const tomorrowStr = new Date(TODAY.getTime() + 86400000)
    .toISOString()
    .slice(0, 10);

  const notifications = useMemo<Notification[]>(() => {
    const list: Notification[] = [];

    // — Manufacturing alerts —
    const stoppedMachines = MACHINES.filter((m) => m.status === "Stopped");
    stoppedMachines.forEach((m) =>
      list.push({
        id: `machine-${m.id}`,
        type: "critical",
        title: `${m.name} stopped`,
        detail: m.alerts[0] ?? "Machine is offline",
        href: "/production",
      })
    );

    const criticalStock = INVENTORY_ITEMS.filter((i) => i.status === "Critical");
    criticalStock.slice(0, 2).forEach((i) =>
      list.push({
        id: `stock-${i.id}`,
        type: "critical",
        title: `Critical stock: ${i.name}`,
        detail: `${i.stock} ${i.unit} remaining — reorder at ${i.reorderLevel}`,
        href: "/inventory",
      })
    );

    const openVisionAlerts = VISION_ALERTS.filter(
      (a) => a.status === "Open" && a.severity === "High"
    );
    openVisionAlerts.slice(0, 2).forEach((a) =>
      list.push({
        id: `vision-${a.id}`,
        type: "warning",
        title: a.type,
        detail: `${a.camera} — ${a.description}`,
        href: "/vision",
      })
    );

    const delayedOrders = CUSTOMER_ORDERS.filter((o) => o.status === "Delayed");
    delayedOrders.slice(0, 2).forEach((o) =>
      list.push({
        id: `order-${o.id}`,
        type: "warning",
        title: `Order delayed: ${o.customer}`,
        detail: `${o.product} · Due ${new Date(o.promisedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`,
        href: "/orders",
      })
    );

    // — CRM alerts —
    const overdue = followUps.filter((f) => f.status === "Overdue");
    overdue.slice(0, 2).forEach((f) =>
      list.push({
        id: f.id,
        type: "warning",
        title: "Overdue follow-up",
        detail: `${f.leadName} · was due ${new Date(f.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`,
        href: `/leads/${f.leadId}`,
      })
    );

    const dueToday = followUps.filter(
      (f) => f.dueDate === todayStr && f.status === "Pending"
    );
    dueToday.slice(0, 2).forEach((f) =>
      list.push({
        id: `today-${f.id}`,
        type: "info",
        title: "Follow-up due today",
        detail: `${f.leadName} · ${f.executive}`,
        href: `/leads/${f.leadId}`,
      })
    );

    const upcomingVisits = siteVisits.filter(
      (v) =>
        v.status === "Scheduled" &&
        (v.date === todayStr || v.date === tomorrowStr)
    );
    upcomingVisits.slice(0, 2).forEach((v) =>
      list.push({
        id: `visit-${v.id}`,
        type: "info",
        title: `Site visit ${v.date === todayStr ? "today" : "tomorrow"}`,
        detail: `${v.leadName} · ${v.executive}`,
        href: `/leads/${v.leadId}`,
      })
    );

    return list;
  }, [followUps, siteVisits, todayStr, tomorrowStr]);

  const criticalCount = notifications.filter((n) => n.type === "critical").length;
  const dotColor = criticalCount > 0 ? "bg-rose-500" : "bg-primary";

  const ICON_MAP = {
    critical: XCircle,
    warning: AlertTriangle,
    info: CheckCircle2,
  };
  const COLOR_MAP = {
    critical: "text-rose-500",
    warning: "text-amber-500",
    info: "text-blue-500",
  };

  // initials from role label
  const initials = roleDef.label
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-6 gap-4">
      <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>

      <div className="flex items-center gap-3 shrink-0">
        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors outline-none">
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span
                className={cn(
                  "absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full",
                  dotColor
                )}
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {notifications.length > 0 && (
                <span className="text-xs font-normal text-muted-foreground">
                  {notifications.length} active
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 py-6 text-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <p className="text-sm text-muted-foreground">All clear</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = ICON_MAP[n.type];
                  return (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex items-start gap-2.5 py-2.5 cursor-pointer"
                      onClick={() => n.href && router.push(n.href)}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 mt-0.5 shrink-0",
                          COLOR_MAP[n.type]
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug mt-0.5 truncate">
                          {n.detail}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary transition-colors outline-none">
            <Avatar size="sm">
              <AvatarFallback
                className="font-semibold text-[11px]"
                style={{
                  background: roleDef.bgColor,
                  color: roleDef.color,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-tight">{roleDef.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                One To Technologies
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-2 border-b border-border mb-1">
              <p className="text-xs font-semibold">{roleDef.emoji} {roleDef.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{roleDef.description}</p>
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/")}>
              <LogOut className="h-4 w-4" /> Switch role / Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
