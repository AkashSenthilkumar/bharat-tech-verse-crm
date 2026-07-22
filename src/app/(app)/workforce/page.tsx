"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceTrendChart } from "@/components/manufacturing/charts";
import {
  OPERATORS,
  ATTENDANCE_TREND,
  WORKFORCE_STATS,
  type OperatorStatus,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

function AttendanceBadge({ status }: { status: OperatorStatus }) {
  const styles: Record<OperatorStatus, string> = {
    Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Absent: "bg-rose-50 text-rose-700 border-rose-200",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border", styles[status])}>
      {status}
    </span>
  );
}

function MiniBar({ value, color = "bg-primary" }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

type StatusFilter = "All" | OperatorStatus;

export default function WorkforcePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filtered = OPERATORS.filter((op) => {
    const matchSearch =
      !search ||
      op.name.toLowerCase().includes(search.toLowerCase()) ||
      op.role.toLowerCase().includes(search.toLowerCase()) ||
      op.machine.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || op.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const topPerformers = [...OPERATORS]
    .filter((op) => op.status === "Present")
    .sort((a, b) => b.productivity - a.productivity)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Operators", value: WORKFORCE_STATS.totalOperators, color: "text-foreground" },
          { label: "Present Today", value: WORKFORCE_STATS.presentToday, color: "text-emerald-600" },
          { label: "Absent", value: WORKFORCE_STATS.absentToday, color: "text-rose-600" },
          { label: "On Leave", value: WORKFORCE_STATS.onLeave, color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Avg Attendance", value: `${WORKFORCE_STATS.avgAttendance}%`, color: "text-foreground" },
          { label: "Avg Productivity", value: `${WORKFORCE_STATS.avgProductivity}%`, color: "text-primary" },
          { label: "OT Hours This Week", value: `${WORKFORCE_STATS.overtimeHoursThisWeek} hrs`, color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance trend + Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Attendance Trend — This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceTrendChart data={ATTENDANCE_TREND} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Performers Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((op, i) => (
              <div key={op.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{op.name}</p>
                  <p className="text-xs text-muted-foreground">{op.role}</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">{op.productivity}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, role, machine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Present", "Absent", "On Leave"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                statusFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Operator table */}
      <Card>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Productivity</TableHead>
                <TableHead>Safety Score</TableHead>
                <TableHead>OT (hrs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((op) => (
                <TableRow
                  key={op.id}
                  className={cn(
                    op.status === "Absent" && "bg-rose-50/40",
                    op.status === "On Leave" && "bg-amber-50/30"
                  )}
                >
                  <TableCell className="font-medium text-sm">{op.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{op.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{op.machine}</TableCell>
                  <TableCell className="text-sm text-center">{op.shift}</TableCell>
                  <TableCell><AttendanceBadge status={op.status} /></TableCell>
                  <TableCell>
                    <MiniBar
                      value={op.attendance}
                      color={op.attendance >= 90 ? "bg-emerald-500" : op.attendance >= 80 ? "bg-amber-400" : "bg-rose-400"}
                    />
                  </TableCell>
                  <TableCell>
                    {op.status === "Present" ? (
                      <MiniBar
                        value={op.productivity}
                        color={op.productivity >= 90 ? "bg-emerald-500" : op.productivity >= 70 ? "bg-primary" : "bg-rose-400"}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-sm font-semibold", op.safetyScore >= 95 ? "text-emerald-600" : op.safetyScore >= 85 ? "text-amber-600" : "text-rose-600")}>
                      {op.safetyScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">{op.overtime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
