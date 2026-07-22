"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Gauge,
  MapPinned,
  Package,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  WeeklyProductionChart,
  OeeTrendChart,
  MachineStatusDonut,
} from "@/components/manufacturing/charts";
import { useCrm } from "@/lib/store";
import {
  FACTORY_STATS,
  MACHINES,
  PRODUCTION_ORDERS,
  INVENTORY_ITEMS,
  WEEKLY_PRODUCTION,
  OEE_TREND,
} from "@/lib/manufacturing-data";
import { TODAY } from "@/lib/data";
import { cn } from "@/lib/utils";

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Gauge;
  accent?: "warning" | "danger" | "success";
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p
              className={cn(
                "text-2xl font-bold tracking-tight mt-1",
                accent === "danger" && "text-rose-600",
                accent === "warning" && "text-amber-600",
                accent === "success" && "text-emerald-600"
              )}
            >
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
              accent === "danger"
                ? "bg-rose-50 text-rose-600"
                : accent === "warning"
                ? "bg-amber-50 text-amber-600"
                : accent === "success"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-primary/10 text-primary"
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductionStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "At Risk": "bg-rose-50 text-rose-700 border-rose-200",
    Planned: "bg-slate-50 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
        styles[status] ?? "bg-slate-50 text-slate-600 border-slate-200"
      )}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    High: "text-rose-600 bg-rose-50",
    Medium: "text-amber-600 bg-amber-50",
    Low: "text-slate-500 bg-slate-50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
        styles[priority] ?? "text-slate-500 bg-slate-50"
      )}
    >
      {priority}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { leads, followUps, siteVisits } = useCrm();

  const todayStr = TODAY.toISOString().slice(0, 10);
  const activeLeads = leads.filter((l) => l.status !== "Won" && l.status !== "Lost").length;
  const todaysFollowUps = followUps.filter(
    (f) => f.dueDate === todayStr && f.status !== "Done"
  ).length;
  const scheduledVisits = siteVisits.filter((s) => s.status === "Scheduled").length;

  const machineStatusData = [
    { name: "Running", value: FACTORY_STATS.machinesRunning },
    { name: "Stopped", value: 1 },
    { name: "Maintenance", value: 1 },
  ];

  const alertInventory = INVENTORY_ITEMS.filter((i) => i.status !== "OK");
  const activeOrders = PRODUCTION_ORDERS.filter(
    (o) => o.status === "In Progress" || o.status === "At Risk"
  );

  const productionPct = Math.round(
    (FACTORY_STATS.todayProduced / FACTORY_STATS.todayTarget) * 100
  );

  return (
    <div className="space-y-6">
      {/* Manufacturing KPIs */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
          Manufacturing — Today
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Today's Production"
            value={`${FACTORY_STATS.todayProduced.toLocaleString()}`}
            sub={`${productionPct}% of ${FACTORY_STATS.todayTarget.toLocaleString()} target`}
            icon={Zap}
            accent={productionPct >= 90 ? "success" : productionPct >= 75 ? undefined : "warning"}
          />
          <KpiCard
            label="Overall OEE"
            value={`${FACTORY_STATS.oee}%`}
            sub="World-class ≥ 85%"
            icon={Gauge}
            accent={FACTORY_STATS.oee >= 85 ? "success" : "warning"}
          />
          <KpiCard
            label="Machines Running"
            value={`${FACTORY_STATS.machinesRunning} / ${FACTORY_STATS.machinesTotal}`}
            sub="1 stopped · 1 in maintenance"
            icon={Wrench}
            accent="warning"
          />
          <KpiCard
            label="Inventory Alerts"
            value={`${FACTORY_STATS.inventoryAlerts} items`}
            sub="3 Low · 1 Critical"
            icon={Package}
            accent="danger"
          />
        </div>
      </div>

      {/* CRM KPIs */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
          CRM — Live
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            label="Active Leads"
            value={String(activeLeads)}
            sub="Real estate & interior design"
            icon={Users}
          />
          <KpiCard
            label="Today's Follow-ups"
            value={String(todaysFollowUps)}
            sub="Pending action"
            icon={CalendarClock}
            accent={todaysFollowUps > 3 ? "warning" : undefined}
          />
          <KpiCard
            label="Site Visits Scheduled"
            value={String(scheduledVisits)}
            sub="Upcoming visits"
            icon={MapPinned}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Weekly Production — Target vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyProductionChart data={WEEKLY_PRODUCTION} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Machine Status</CardTitle>
          </CardHeader>
          <CardContent>
            <MachineStatusDonut data={machineStatusData} />
          </CardContent>
        </Card>
      </div>

      {/* OEE Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>OEE Trend — Last 6 Weeks</CardTitle>
        </CardHeader>
        <CardContent>
          <OeeTrendChart data={OEE_TREND} />
        </CardContent>
      </Card>

      {/* Active Orders + Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Active Production Orders</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1"
              onClick={() => router.push("/production")}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrders.map((order) => {
                  const pct = Math.round((order.produced / order.qty) * 100);
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                          {order.product}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">{order.customer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ProductionStatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Inventory Alerts</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1"
              onClick={() => router.push("/inventory")}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertInventory.map((item) => {
              const pct = Math.round((item.stock / item.maxStock) * 100);
              const isCritical = item.status === "Critical";
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isCritical ? "text-rose-600" : "text-amber-600"
                      )}
                    >
                      {item.stock} {item.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-5">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          isCritical ? "bg-rose-500" : "bg-amber-400"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground w-20 text-right">
                      Reorder: {item.reorderLevel} {item.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
