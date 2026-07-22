"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Columns3,
  List,
  Thermometer,
  Timer,
  User,
  Wrench,
  XCircle,
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
import { MachineTargetChart } from "@/components/manufacturing/charts";
import {
  MACHINES,
  PRODUCTION_ORDERS,
  SHIFT_PERFORMANCE,
  FACTORY_STATS,
  type Machine,
  type MachineStatus,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

function MachineBadge({ status }: { status: MachineStatus }) {
  const styles: Record<MachineStatus, string> = {
    Running: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Stopped: "bg-rose-50 text-rose-700 border-rose-200",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const icons: Record<MachineStatus, typeof CheckCircle2> = {
    Running: CheckCircle2,
    Stopped: XCircle,
    Maintenance: Wrench,
  };
  const Icon = icons[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border",
        styles[status]
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
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

function MachineCard({ machine }: { machine: Machine }) {
  const pct = Math.round((machine.produced / machine.target) * 100);
  const isStopped = machine.status === "Stopped";
  const isMaintenance = machine.status === "Maintenance";

  return (
    <Card
      className={cn(
        isStopped && "border-rose-200 bg-rose-50/30",
        isMaintenance && "border-amber-200 bg-amber-50/20"
      )}
    >
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm">{machine.name}</p>
            <p className="text-xs text-muted-foreground">{machine.type}</p>
          </div>
          <MachineBadge status={machine.status} />
        </div>

        {/* Operator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          {machine.operator} · Shift {machine.shift}
        </div>

        {/* Production progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Production</span>
            <span className="font-semibold">
              {machine.produced} / {machine.target} pcs
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                pct >= 90
                  ? "bg-emerald-500"
                  : pct >= 70
                  ? "bg-primary"
                  : "bg-rose-400"
              )}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-right">{pct}% of target</p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="text-center p-1.5 rounded-md bg-secondary/50">
            <p className="text-xs font-bold">{machine.oee}%</p>
            <p className="text-[10px] text-muted-foreground">OEE</p>
          </div>
          <div className="text-center p-1.5 rounded-md bg-secondary/50">
            <p className="text-xs font-bold flex items-center justify-center gap-0.5">
              <Thermometer className="h-3 w-3" />
              {machine.temperature > 0 ? `${machine.temperature}°` : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">Temp</p>
          </div>
          <div className="text-center p-1.5 rounded-md bg-secondary/50">
            <p className="text-xs font-bold flex items-center justify-center gap-0.5">
              <Timer className="h-3 w-3" />
              {machine.downtime === "0m" ? "0m" : machine.downtime}
            </p>
            <p className="text-[10px] text-muted-foreground">D/T</p>
          </div>
        </div>

        {/* Alerts */}
        {machine.alerts.length > 0 && (
          <div className="space-y-1">
            {machine.alerts.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-1.5 text-[11px] px-2 py-1.5 rounded",
                  isStopped
                    ? "bg-rose-100/80 text-rose-700"
                    : "bg-amber-100/80 text-amber-700"
                )}
              >
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                {alert}
              </div>
            ))}
          </div>
        )}
        {machine.alerts.length === 0 && (
          <p className="text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> No alerts
          </p>
        )}
      </CardContent>
    </Card>
  );
}

type FilterStatus = "All" | MachineStatus;
type ViewMode = "list" | "kanban";

const KANBAN_COLUMNS: { status: string; label: string; color: string; bg: string }[] = [
  { status: "Planned", label: "Planned", color: "#6b7280", bg: "bg-slate-50 border-slate-200" },
  { status: "In Progress", label: "In Progress", color: "#d97706", bg: "bg-amber-50 border-amber-200" },
  { status: "At Risk", label: "At Risk", color: "#dc2626", bg: "bg-rose-50 border-rose-200" },
  { status: "Completed", label: "Completed", color: "#16a34a", bg: "bg-emerald-50 border-emerald-200" },
];

function KanbanCard({ order, onAdvance }: {
  order: typeof PRODUCTION_ORDERS[0];
  onAdvance: (id: string) => void;
}) {
  const pct = Math.round((order.produced / order.qty) * 100);
  const canAdvance = order.status !== "Completed";
  return (
    <div className="bg-background border border-border rounded-lg p-3 space-y-2.5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground">{order.id}</p>
          <p className="text-sm font-semibold leading-tight truncate mt-0.5">{order.product}</p>
        </div>
        <PriorityBadge priority={order.priority} />
      </div>
      <p className="text-xs text-muted-foreground truncate">{order.machine}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{order.produced}/{order.qty} pcs</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn("h-full rounded-full", pct >= 90 ? "bg-emerald-500" : pct >= 50 ? "bg-primary" : "bg-amber-400")}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Due {new Date(order.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
        </p>
        {canAdvance && (
          <button
            onClick={() => onAdvance(order.id)}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Advance <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

const STATUS_SEQUENCE: Record<string, string> = {
  "Planned": "In Progress",
  "In Progress": "Completed",
  "At Risk": "Completed",
};

export default function ProductionPage() {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(PRODUCTION_ORDERS.map((o) => [o.id, o.status]))
  );

  function advanceOrder(id: string) {
    setOrderStatuses((prev) => {
      const next = STATUS_SEQUENCE[prev[id]];
      return next ? { ...prev, [id]: next } : prev;
    });
  }

  const running = MACHINES.filter((m) => m.status === "Running").length;
  const stopped = MACHINES.filter((m) => m.status === "Stopped").length;
  const maintenance = MACHINES.filter((m) => m.status === "Maintenance").length;

  const filtered =
    filter === "All" ? MACHINES : MACHINES.filter((m) => m.status === filter);

  const machineChartData = MACHINES.map((m) => ({
    name: m.name.replace("Machine ", "M/C ").replace(" Machine", ""),
    target: m.target,
    produced: m.produced,
  }));

  const activeOrders = PRODUCTION_ORDERS.filter(
    (o) => o.status !== "Planned"
  );

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Today's Target", value: `${FACTORY_STATS.todayTarget.toLocaleString()} pcs`, color: "text-foreground" },
          { label: "Produced", value: `${FACTORY_STATS.todayProduced.toLocaleString()} pcs`, color: "text-primary" },
          { label: "OEE", value: `${FACTORY_STATS.oee}%`, color: "text-amber-600" },
          { label: "Rejection Rate", value: `${FACTORY_STATS.rejectionRate}%`, color: "text-rose-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Machine filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["All", "Running", "Stopped", "Maintenance"] as FilterStatus[]).map((f) => {
          const count =
            f === "All"
              ? MACHINES.length
              : f === "Running"
              ? running
              : f === "Stopped"
              ? stopped
              : maintenance;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {f}{" "}
              <span
                className={cn(
                  "ml-1 text-xs",
                  filter === f ? "opacity-80" : "opacity-60"
                )}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Machine cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>

      {/* Target vs Actual chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Machine-wise Target vs Actual (Today)</CardTitle>
        </CardHeader>
        <CardContent>
          <MachineTargetChart data={machineChartData} />
        </CardContent>
      </Card>

      {/* Work Orders — List / Kanban toggle */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Work Orders</CardTitle>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  viewMode === "list"
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  viewMode === "kanban"
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Columns3 className="h-3.5 w-3.5" /> Kanban
              </button>
            </div>
          </div>
        </CardHeader>

        {viewMode === "list" ? (
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRODUCTION_ORDERS.map((order) => {
                  const currentStatus = orderStatuses[order.id] ?? order.status;
                  const pct = Math.round((order.produced / order.qty) * 100);
                  return (
                    <TableRow
                      key={order.id}
                      className={cn(currentStatus === "At Risk" && "bg-rose-50/40")}
                    >
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="text-sm max-w-[160px] truncate">{order.product}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.customer}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.machine}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-12">{order.produced}/{order.qty}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </TableCell>
                      <TableCell><PriorityBadge priority={order.priority} /></TableCell>
                      <TableCell><ProductionStatusBadge status={currentStatus} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        ) : (
          <CardContent className="pt-2 pb-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {KANBAN_COLUMNS.map((col) => {
                const cards = PRODUCTION_ORDERS.filter(
                  (o) => (orderStatuses[o.id] ?? o.status) === col.status
                );
                return (
                  <div key={col.status} className="space-y-2">
                    <div className={cn("flex items-center justify-between px-2.5 py-2 rounded-lg border", col.bg)}>
                      <p className="text-xs font-bold" style={{ color: col.color }}>
                        {col.label}
                      </p>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${col.color}20`, color: col.color }}
                      >
                        {cards.length}
                      </span>
                    </div>
                    <div className="space-y-2 min-h-[120px]">
                      {cards.map((order) => (
                        <KanbanCard
                          key={order.id}
                          order={{ ...order, status: (orderStatuses[order.id] ?? order.status) as typeof order.status }}
                          onAdvance={advanceOrder}
                        />
                      ))}
                      {cards.length === 0 && (
                        <div className="h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                          <p className="text-xs text-muted-foreground">No orders</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-right">
              Click "Advance →" on a card to move it to the next stage
            </p>
          </CardContent>
        )}
      </Card>

      {/* Shift Performance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Shift Performance</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Achievement</TableHead>
                <TableHead>OEE</TableHead>
                <TableHead>Operators</TableHead>
                <TableHead>Rejections</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SHIFT_PERFORMANCE.map((shift) => {
                const achievement = Math.round((shift.actual / shift.target) * 100);
                return (
                  <TableRow key={shift.shift}>
                    <TableCell className="font-medium text-sm">{shift.shift}</TableCell>
                    <TableCell className="text-sm">{shift.target.toLocaleString()}</TableCell>
                    <TableCell className="text-sm font-semibold">{shift.actual.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              achievement >= 90 ? "bg-emerald-500" : achievement >= 75 ? "bg-primary" : "bg-rose-400"
                            )}
                            style={{ width: `${Math.min(achievement, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{achievement}%</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn("text-sm font-semibold", shift.oee >= 85 ? "text-emerald-600" : "text-amber-600")}>
                      {shift.oee}%
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{shift.operators}</TableCell>
                    <TableCell className="text-sm text-rose-600 font-medium">{shift.rejections}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
