"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimplePieChart, ProfitabilityChart } from "@/components/manufacturing/charts";
import {
  COST_BREAKDOWN,
  MONTHLY_PROFITABILITY,
  PRODUCT_MARGINS,
  FINANCE_STATS,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

export default function FinancePage() {
  const costPieData = COST_BREAKDOWN.map((c) => ({ name: c.category, value: c.amount }));
  const fmt = (v: number) => `₹${(v / 100000).toFixed(2)}L`;

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Revenue (This Month)</p>
            <p className="text-2xl font-bold mt-1">{fmt(FINANCE_STATS.revenueThisMonth)}</p>
            <p className="text-xs text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="h-3 w-3" />+{FINANCE_STATS.revenueGrowth}% vs last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="text-2xl font-bold mt-1 text-rose-600">{fmt(FINANCE_STATS.totalCost)}</p>
            <p className="text-xs text-muted-foreground mt-1">Material: {FINANCE_STATS.materialCostPct}% of cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Gross Profit</p>
            <p className="text-2xl font-bold mt-1 text-emerald-600">{fmt(FINANCE_STATS.grossProfit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Gross Margin</p>
            <p className="text-2xl font-bold mt-1 text-primary">{FINANCE_STATS.grossMargin}%</p>
            <p className="text-xs text-muted-foreground mt-1">Industry avg ~38%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Monthly Revenue, Cost & Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfitabilityChart data={MONTHLY_PROFITABILITY} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={costPieData} />
          </CardContent>
        </Card>
      </div>

      {/* Cost breakdown table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Cost Structure — This Month</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Share of Total Cost</TableHead>
                <TableHead>Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COST_BREAKDOWN.map((c) => (
                <TableRow key={c.category}>
                  <TableCell className="font-medium text-sm">{c.category}</TableCell>
                  <TableCell className="text-sm font-semibold">₹{c.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.percentage}%</TableCell>
                  <TableCell>
                    <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${c.percentage}%` }} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product margin table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Product-wise Margin Analysis</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Unit Cost (₹)</TableHead>
                <TableHead>Unit Price (₹)</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Volume (pcs)</TableHead>
                <TableHead>Contribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRODUCT_MARGINS.map((p) => {
                const contribution = (p.unitPrice - p.unitCost) * p.volume;
                return (
                  <TableRow key={p.product}>
                    <TableCell className="font-medium text-sm max-w-[180px] truncate">{p.product}</TableCell>
                    <TableCell className="text-sm">₹{p.unitCost.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">₹{p.unitPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-bold", p.margin >= 30 ? "text-emerald-600" : p.margin >= 20 ? "text-primary" : "text-amber-600")}>
                          {p.margin}%
                        </span>
                        {p.margin >= 30 ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.volume}</TableCell>
                    <TableCell className="text-sm font-semibold">₹{contribution.toLocaleString()}</TableCell>
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
