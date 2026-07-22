"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SimplePieChart,
  RejectionByMachineChart,
  TrendLineChart,
} from "@/components/manufacturing/charts";
import {
  DEFECT_TYPES,
  FPY_TREND,
  REJECTION_BY_MACHINE,
  DEFECT_LOG,
  QUALITY_STATS,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

export default function QualityPage() {
  const pieData = DEFECT_TYPES.map((d) => ({ name: d.type, value: d.count }));

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Inspected Today", value: QUALITY_STATS.totalInspected, color: "text-foreground" },
          { label: "Passed", value: QUALITY_STATS.totalPassed, color: "text-emerald-600" },
          { label: "Rejected", value: QUALITY_STATS.totalRejected, color: "text-rose-600" },
          { label: "First Pass Yield", value: `${QUALITY_STATS.fpy}%`, color: "text-primary" },
          { label: "Reworked", value: QUALITY_STATS.reworked, color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Defect Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={pieData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>First Pass Yield Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={FPY_TREND}
              dataKey="fpy"
              label="FPY"
              domain={[90, 100]}
              formatter={(v) => `${v}%`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Rejection Rate by Machine</CardTitle>
          </CardHeader>
          <CardContent>
            <RejectionByMachineChart data={REJECTION_BY_MACHINE} />
          </CardContent>
        </Card>
      </div>

      {/* Defect breakdown table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Defect Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Defect Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Share</TableHead>
                <TableHead>Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEFECT_TYPES.map((d) => (
                <TableRow key={d.type}>
                  <TableCell className="font-medium text-sm">{d.type}</TableCell>
                  <TableCell className="text-sm">{d.count}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.percentage}%</TableCell>
                  <TableCell>
                    <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-400"
                        style={{ width: `${d.percentage}%` }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Defect log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Today's Defect Log</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Defect Type</TableHead>
                <TableHead>Part</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Action Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEFECT_LOG.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.time}</TableCell>
                  <TableCell className="text-sm">{log.machine}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {log.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.part}</TableCell>
                  <TableCell className="text-sm font-semibold text-rose-600">{log.qty}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
