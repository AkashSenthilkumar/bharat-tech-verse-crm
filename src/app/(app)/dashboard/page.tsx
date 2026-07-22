"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarClock,
  Camera,
  CheckCircle2,
  ClipboardList,
  Factory,
  HardHat,
  IndianRupee,
  MapPinned,
  Package,
  ShieldCheck,
  Truck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyProductionChart, MachineStatusDonut, OeeTrendChart } from "@/components/manufacturing/charts";
import {
  FACTORY_STATS,
  MACHINES,
  INVENTORY_ITEMS,
  PRODUCTION_ORDERS,
  VISION_STATS,
  WORKFORCE_STATS,
  QUALITY_STATS,
  ORDER_STATS,
  FINANCE_STATS,
  ENERGY_STATS,
  WEEKLY_PRODUCTION,
  OEE_TREND,
} from "@/lib/manufacturing-data";
import { useRole } from "@/lib/role-store";
import { useCrm } from "@/lib/store";
import { cn } from "@/lib/utils";

// ─── Shared primitives ────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  color = "text-foreground",
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  href?: string;
}) {
  const inner = (
    <CardContent className="pt-4 pb-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-bold mt-1 font-variant-numeric tabular-nums", color)}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </CardContent>
  );
  return href ? (
    <Link href={href}><Card className="hover:border-primary/40 transition-colors cursor-pointer">{inner}</Card></Link>
  ) : (
    <Card>{inner}</Card>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  count,
  color,
}: {
  href: string;
  icon: typeof Factory;
  label: string;
  count?: string | number;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-md shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {count !== undefined && (
          <p className="text-xs text-muted-foreground truncate">{count}</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </Link>
  );
}

function AlertRow({
  type,
  title,
  sub,
  href,
}: {
  type: "critical" | "warning";
  title: string;
  sub: string;
  href?: string;
}) {
  const isCritical = type === "critical";
  const row = (
    <div
      className={cn(
        "flex items-start gap-2.5 p-3 rounded-lg border text-sm",
        isCritical
          ? "bg-rose-50 border-rose-200 text-rose-700"
          : "bg-amber-50 border-amber-200 text-amber-700"
      )}
    >
      {isCritical ? (
        <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
      ) : (
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      )}
      <div className="min-w-0">
        <p className="font-medium leading-tight">{title}</p>
        <p className="text-xs opacity-75 mt-0.5">{sub}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{row}</Link> : row;
}

// ─── Role hubs ────────────────────────────────────────────────

function MdHub() {
  const { leads, followUps, siteVisits } = useCrm();
  const stoppedMachines = MACHINES.filter((m) => m.status === "Stopped");
  const criticalStock = INVENTORY_ITEMS.filter((i) => i.status === "Critical");
  const openLeads = leads.filter((l) => !["Won", "Lost"].includes(l.status));
  const overdueFollowups = followUps.filter((f) => f.status === "Overdue");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Good morning 👔</h2>
        <p className="text-sm text-muted-foreground">Operational overview for today.</p>
      </div>

      {(stoppedMachines.length > 0 || criticalStock.length > 0) && (
        <div className="space-y-2">
          {stoppedMachines.map((m) => (
            <AlertRow key={m.id} type="critical" title={`${m.name} is offline`} sub={m.alerts[0] ?? "Machine stopped"} href="/production" />
          ))}
          {criticalStock.map((i) => (
            <AlertRow key={i.id} type="warning" title={`Critical stock: ${i.name}`} sub={`${i.stock} ${i.unit} remaining`} href="/inventory" />
          ))}
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Manufacturing</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Today's Output" value={FACTORY_STATS.todayProduced} sub={`Target: ${FACTORY_STATS.todayTarget}`} href="/production" />
          <KpiCard label="Avg OEE" value={`${FACTORY_STATS.oee}%`} color={FACTORY_STATS.oee >= 80 ? "text-emerald-600" : "text-amber-600"} href="/production" />
          <KpiCard label="Machines Running" value={`${FACTORY_STATS.machinesRunning}/${FACTORY_STATS.machinesTotal}`} color="text-emerald-600" href="/production" />
          <KpiCard label="FPY" value={`${QUALITY_STATS.fpy}%`} color={QUALITY_STATS.fpy >= 95 ? "text-emerald-600" : "text-amber-600"} href="/quality" />
          <KpiCard label="OTD %" value={`${ORDER_STATS.otdPercentage}%`} color={ORDER_STATS.otdPercentage >= 90 ? "text-emerald-600" : "text-amber-600"} href="/orders" />
          <KpiCard label="Gross Margin" value={`${FINANCE_STATS.grossMargin}%`} color="text-primary" href="/finance" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle>Weekly Production</CardTitle></CardHeader>
          <CardContent><WeeklyProductionChart data={WEEKLY_PRODUCTION} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Machine Status</CardTitle></CardHeader>
          <CardContent><MachineStatusDonut data={[
              { name: "Running", value: MACHINES.filter((m) => m.status === "Running").length },
              { name: "Stopped", value: MACHINES.filter((m) => m.status === "Stopped").length },
              { name: "Maintenance", value: MACHINES.filter((m) => m.status === "Maintenance").length },
            ]} /></CardContent>
        </Card>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">CRM Pipeline</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Active Leads" value={openLeads.length} href="/leads" />
          <KpiCard label="Overdue Follow-ups" value={overdueFollowups.length} color={overdueFollowups.length > 0 ? "text-rose-600" : "text-foreground"} href="/followups" />
          <KpiCard label="Site Visits Scheduled" value={siteVisits.filter((v) => v.status === "Scheduled").length} href="/site-visits" />
          <KpiCard label="Won This Month" value={leads.filter((l) => l.status === "Won").length} color="text-emerald-600" href="/leads" />
        </div>
      </div>
    </div>
  );
}

function PlantManagerHub() {
  const stoppedMachines = MACHINES.filter((m) => m.status === "Stopped");
  const atRisk = PRODUCTION_ORDERS.filter((o) => o.status === "At Risk");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Plant Overview 🏭</h2>
        <p className="text-sm text-muted-foreground">Manufacturing operations status for today.</p>
      </div>

      {(stoppedMachines.length > 0 || atRisk.length > 0) && (
        <div className="space-y-2">
          {stoppedMachines.map((m) => (
            <AlertRow key={m.id} type="critical" title={`${m.name} offline`} sub={m.alerts[0] ?? ""} href="/production" />
          ))}
          {atRisk.map((o) => (
            <AlertRow key={o.id} type="warning" title={`Work order at risk: ${o.id}`} sub={`${o.product} — due ${o.dueDate}`} href="/production" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Today's Output" value={FACTORY_STATS.todayProduced} sub={`/ ${FACTORY_STATS.todayTarget} target`} href="/production" />
        <KpiCard label="Avg OEE" value={`${FACTORY_STATS.oee}%`} color={FACTORY_STATS.oee >= 80 ? "text-emerald-600" : "text-amber-600"} href="/production" />
        <KpiCard label="FPY" value={`${QUALITY_STATS.fpy}%`} href="/quality" />
        <KpiCard label="Open Incidents" value={VISION_STATS.openIncidents} color={VISION_STATS.openIncidents > 0 ? "text-rose-600" : "text-emerald-600"} href="/vision" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle>OEE Trend</CardTitle></CardHeader>
          <CardContent><OeeTrendChart data={OEE_TREND} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Machine Status</CardTitle></CardHeader>
          <CardContent><MachineStatusDonut data={[
              { name: "Running", value: MACHINES.filter((m) => m.status === "Running").length },
              { name: "Stopped", value: MACHINES.filter((m) => m.status === "Stopped").length },
              { name: "Maintenance", value: MACHINES.filter((m) => m.status === "Maintenance").length },
            ]} /></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickLink href="/workforce" icon={HardHat} label="Workforce" count={`${WORKFORCE_STATS.presentToday}/${WORKFORCE_STATS.totalOperators} present`} color="#8b5cf6" />
        <QuickLink href="/inventory" icon={Package} label="Inventory" count={`${INVENTORY_ITEMS.filter((i) => i.status !== "OK").length} alerts`} color="#f97316" />
        <QuickLink href="/energy" icon={Zap} label="Energy" count={`${ENERGY_STATS.todayKwh} kWh today`} color="#eab308" />
      </div>
    </div>
  );
}

function ProductionSupervisorHub() {
  const stoppedMachines = MACHINES.filter((m) => m.status === "Stopped");
  const inProgress = PRODUCTION_ORDERS.filter((o) => o.status === "In Progress");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Shop Floor ⚙️</h2>
        <p className="text-sm text-muted-foreground">Live floor status — machines, orders, safety.</p>
      </div>

      {stoppedMachines.map((m) => (
        <AlertRow key={m.id} type="critical" title={`${m.name} offline`} sub={m.alerts[0] ?? ""} href="/production" />
      ))}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Running Machines" value={`${FACTORY_STATS.machinesRunning}/${FACTORY_STATS.machinesTotal}`} color="text-emerald-600" href="/production" />
        <KpiCard label="Orders Active" value={inProgress.length} href="/production" />
        <KpiCard label="FPY Today" value={`${QUALITY_STATS.fpy}%`} color={QUALITY_STATS.fpy >= 95 ? "text-emerald-600" : "text-amber-600"} href="/quality" />
        <KpiCard label="Safety Score" value={`${VISION_STATS.overallSafetyScore}%`} color={VISION_STATS.overallSafetyScore >= 90 ? "text-emerald-600" : "text-amber-600"} href="/vision" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickLink href="/production" icon={Factory} label="Production Board" count={`${inProgress.length} orders in progress`} color="#8b5cf6" />
        <QuickLink href="/quality" icon={ShieldCheck} label="Quality Checks" count={`${QUALITY_STATS.totalRejected} rejections today`} color="#0d9e9a" />
        <QuickLink href="/vision" icon={Camera} label="Factory Vision" count={`${VISION_STATS.openIncidents} open incidents`} color="#f97316" />
        <QuickLink href="/energy" icon={Zap} label="Energy" count={`${ENERGY_STATS.todayKwh} kWh consumed`} color="#eab308" />
      </div>
    </div>
  );
}

function MachineOperatorHub() {
  const myMachine = MACHINES[0];
  const pct = Math.round((myMachine.produced / myMachine.target) * 100);
  const myOrders = PRODUCTION_ORDERS.filter((o) => o.status === "In Progress").slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">My Machine 🔧</h2>
        <p className="text-sm text-muted-foreground">Your workstation view for today's shift.</p>
      </div>

      {myMachine.alerts.length > 0 && (
        <div className="space-y-2">
          {myMachine.alerts.map((a, i) => (
            <AlertRow key={i} type="warning" title="Machine alert" sub={a} />
          ))}
        </div>
      )}

      <Card className={cn("border-2", myMachine.status === "Running" ? "border-emerald-200" : "border-rose-200")}>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xl font-bold">{myMachine.name}</p>
              <p className="text-sm text-muted-foreground">{myMachine.type}</p>
            </div>
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border", myMachine.status === "Running" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200")}>
              {myMachine.status === "Running" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {myMachine.status}
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Production Today</span>
              <span className="font-bold text-base">{myMachine.produced} / {myMachine.target} pcs</span>
            </div>
            <div className="h-4 rounded-full bg-secondary overflow-hidden">
              <div className={cn("h-full rounded-full", pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-primary" : "bg-rose-400")} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <p className="text-sm text-right font-semibold">{pct}% of daily target</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "OEE", value: `${myMachine.oee}%` },
              { label: "Temperature", value: `${myMachine.temperature}°C` },
              { label: "Downtime", value: myMachine.downtime === "0m" ? "None" : myMachine.downtime },
            ].map((m) => (
              <div key={m.label} className="text-center p-3 rounded-lg bg-secondary/50">
                <p className="text-lg font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {myOrders.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle>Active Work Orders</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {myOrders.map((o) => {
              const p = Math.round((o.produced / o.qty) * 100);
              return (
                <div key={o.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{o.id}</p>
                    <span className="text-xs text-muted-foreground font-mono">{o.product}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${p}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{o.produced}/{o.qty} pcs · due {o.dueDate}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QualityInspectorHub() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Quality Control 🔬</h2>
        <p className="text-sm text-muted-foreground">Today's inspection metrics and defect summary.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Inspected Today" value={QUALITY_STATS.totalInspected} href="/quality" />
        <KpiCard label="Passed" value={QUALITY_STATS.totalPassed} color="text-emerald-600" href="/quality" />
        <KpiCard label="Rejected" value={QUALITY_STATS.totalRejected} color={QUALITY_STATS.totalRejected > 10 ? "text-rose-600" : "text-amber-600"} href="/quality" />
        <KpiCard label="FPY" value={`${QUALITY_STATS.fpy}%`} color={QUALITY_STATS.fpy >= 95 ? "text-emerald-600" : "text-amber-600"} href="/quality" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickLink href="/quality" icon={ShieldCheck} label="Quality Dashboard" count="Full defect analysis" color="#0d9e9a" />
        <QuickLink href="/production" icon={Factory} label="Production Status" count={`${FACTORY_STATS.machinesRunning} machines running`} color="#2490ef" />
      </div>
    </div>
  );
}

function FinanceManagerHub() {
  const fmt = (v: number) => `₹${(v / 100000).toFixed(1)}L`;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Finance Overview 💰</h2>
        <p className="text-sm text-muted-foreground">This month's P&amp;L and cost summary.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Revenue" value={fmt(FINANCE_STATS.revenueThisMonth)} sub={`+${FINANCE_STATS.revenueGrowth}% vs last month`} href="/finance" />
        <KpiCard label="Total Cost" value={fmt(FINANCE_STATS.totalCost)} color="text-rose-600" href="/finance" />
        <KpiCard label="Gross Profit" value={fmt(FINANCE_STATS.grossProfit)} color="text-emerald-600" href="/finance" />
        <KpiCard label="Margin" value={`${FINANCE_STATS.grossMargin}%`} color="text-primary" href="/finance" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickLink href="/finance" icon={IndianRupee} label="Finance Dashboard" count="P&L, margins, cost breakdown" color="#c8a020" />
        <QuickLink href="/orders" icon={ClipboardList} label="Customer Orders" count={`${ORDER_STATS.totalOrders} orders · ${ORDER_STATS.otdPercentage}% OTD`} color="#2490ef" />
        <QuickLink href="/energy" icon={Zap} label="Energy Costs" count={`₹${ENERGY_STATS.todayCost.toLocaleString()} today`} color="#eab308" />
      </div>
    </div>
  );
}

function ProcurementManagerHub() {
  const lowStock = INVENTORY_ITEMS.filter((i) => i.status !== "OK");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Procurement 🚛</h2>
        <p className="text-sm text-muted-foreground">Purchase orders, vendor status, and stock levels.</p>
      </div>

      {lowStock.length > 0 && (
        <div className="space-y-2">
          {lowStock.slice(0, 3).map((i) => (
            <AlertRow key={i.id} type={i.status === "Critical" ? "critical" : "warning"} title={`${i.status} stock: ${i.name}`} sub={`${i.stock} ${i.unit} remaining · reorder at ${i.reorderLevel}`} href="/inventory" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <KpiCard label="Low Stock Items" value={lowStock.length} color={lowStock.length > 2 ? "text-rose-600" : "text-amber-600"} href="/inventory" />
        <KpiCard label="Energy Today" value={`${ENERGY_STATS.todayKwh} kWh`} href="/energy" />
        <KpiCard label="Delayed Orders" value={ORDER_STATS.delayed} color={ORDER_STATS.delayed > 0 ? "text-rose-600" : "text-emerald-600"} href="/orders" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickLink href="/procurement" icon={Truck} label="Purchase Orders" count="POs, vendors, approvals" color="#f97316" />
        <QuickLink href="/inventory" icon={Package} label="Inventory" count={`${lowStock.length} items need reorder`} color="#8b5cf6" />
      </div>
    </div>
  );
}

function SalesExecutiveHub() {
  const { leads, followUps, siteVisits } = useCrm();
  const todayStr = new Date().toISOString().slice(0, 10);
  const active = leads.filter((l) => !["Won", "Lost"].includes(l.status));
  const dueToday = followUps.filter((f) => f.dueDate === todayStr && f.status === "Pending");
  const overdue = followUps.filter((f) => f.status === "Overdue");
  const scheduled = siteVisits.filter((v) => v.status === "Scheduled");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">CRM Pipeline 👤</h2>
        <p className="text-sm text-muted-foreground">Your leads, follow-ups, and site visit schedule.</p>
      </div>

      {overdue.length > 0 && (
        <div className="space-y-2">
          {overdue.slice(0, 3).map((f) => (
            <AlertRow key={f.id} type="warning" title={`Overdue: ${f.leadName}`} sub={`Due ${new Date(f.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} · ${f.executive}`} href={`/leads/${f.leadId}`} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Active Leads" value={active.length} href="/leads" />
        <KpiCard label="Due Today" value={dueToday.length} color={dueToday.length > 0 ? "text-amber-600" : "text-foreground"} href="/followups" />
        <KpiCard label="Overdue" value={overdue.length} color={overdue.length > 0 ? "text-rose-600" : "text-emerald-600"} href="/followups" />
        <KpiCard label="Site Visits" value={scheduled.length} sub="scheduled" href="/site-visits" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickLink href="/leads" icon={Users} label="All Leads" count={`${active.length} active in pipeline`} color="#ec4899" />
        <QuickLink href="/followups" icon={CalendarClock} label="Follow-ups" count={`${dueToday.length} due today`} color="#f97316" />
        <QuickLink href="/site-visits" icon={MapPinned} label="Site Visits" count={`${scheduled.length} upcoming`} color="#2490ef" />
        <QuickLink href="/reports" icon={BarChart3} label="CRM Reports" count="Conversion & source analysis" color="#8b5cf6" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function DashboardPage() {
  const { role } = useRole();

  const HUB: Record<string, React.ReactNode> = {
    "md": <MdHub />,
    "plant-manager": <PlantManagerHub />,
    "production-supervisor": <ProductionSupervisorHub />,
    "machine-operator": <MachineOperatorHub />,
    "quality-inspector": <QualityInspectorHub />,
    "finance-manager": <FinanceManagerHub />,
    "procurement-manager": <ProcurementManagerHub />,
    "sales-executive": <SalesExecutiveHub />,
  };

  return <div>{HUB[role] ?? <MdHub />}</div>;
}
