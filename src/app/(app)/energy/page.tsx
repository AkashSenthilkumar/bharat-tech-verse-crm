"use client";

import { Lightbulb, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HourlyEnergyChart, MachineEnergyChart } from "@/components/manufacturing/charts";
import {
  HOURLY_ENERGY,
  WEEKLY_ENERGY,
  MACHINE_ENERGY,
  ENERGY_STATS,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

const AI_RECOMMENDATIONS = [
  { text: "CNC Lathe 2 consumed 22% more energy than CNC Lathe 1 despite lower output. Check tool condition and spindle load.", severity: "warning" },
  { text: "Peak demand at 15:00–16:00 is increasing EB costs. Consider shifting Milling M/C 1 operation to 07:00–13:00.", severity: "tip" },
  { text: "Hydraulic Press consumed 9.3 kWh while in maintenance mode. Ensure machines in downtime are powered off.", severity: "warning" },
  { text: "Saturday energy usage is 51% of weekday average. Opportunity to consolidate weekend production to one shift.", severity: "tip" },
];

export default function EnergyPage() {
  const weeklyTotal = WEEKLY_ENERGY.reduce((sum, d) => sum + d.electricity, 0);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Today's Consumption", value: `${ENERGY_STATS.todayKwh} kWh`, color: "text-foreground" },
          { label: "Today's Energy Cost", value: `₹${ENERGY_STATS.todayCost.toLocaleString()}`, color: "text-primary" },
          { label: "Peak Demand", value: `${ENERGY_STATS.peakDemandKw} kW`, color: "text-amber-600" },
          { label: "Water Used Today", value: `${(ENERGY_STATS.waterToday / 1000).toFixed(1)} KL`, color: "text-blue-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Hourly Energy Consumption (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlyEnergyChart data={HOURLY_ENERGY} />
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" />
              Peak demand: 15:00–16:00 (112 kW) — consider load shifting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Machine-wise Energy (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <MachineEnergyChart data={MACHINE_ENERGY} />
          </CardContent>
        </Card>
      </div>

      {/* Weekly trend table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Weekly Energy & Water Consumption</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Electricity (kWh)</TableHead>
                <TableHead>Electricity Cost (₹)</TableHead>
                <TableHead>Water (liters)</TableHead>
                <TableHead>vs Weekly Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WEEKLY_ENERGY.map((d) => {
                const avg = weeklyTotal / WEEKLY_ENERGY.length;
                const vsAvg = (((d.electricity - avg) / avg) * 100).toFixed(1);
                const isAbove = d.electricity > avg;
                return (
                  <TableRow key={d.day}>
                    <TableCell className="font-medium text-sm">{d.day}</TableCell>
                    <TableCell className="text-sm">{d.electricity}</TableCell>
                    <TableCell className="text-sm">₹{(d.electricity * 8).toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.water.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={cn("text-xs font-semibold", isAbove ? "text-rose-600" : "text-emerald-600")}>
                        {isAbove ? "+" : ""}{vsAvg}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            AI Energy Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {AI_RECOMMENDATIONS.map((rec, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border text-sm",
                rec.severity === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
              )}
            >
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
              {rec.text}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
