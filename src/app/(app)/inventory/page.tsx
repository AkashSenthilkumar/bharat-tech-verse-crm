"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { INVENTORY_ITEMS, type StockStatus } from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

type CategoryFilter = "All" | "Raw Material" | "Consumable" | "Finished Goods";

function StockBadge({ status }: { status: StockStatus }) {
  const styles: Record<StockStatus, string> = {
    OK: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Low: "bg-amber-50 text-amber-700 border-amber-200",
    Critical: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const icons: Record<StockStatus, typeof CheckCircle2> = {
    OK: CheckCircle2,
    Low: AlertTriangle,
    Critical: AlertTriangle,
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

function StockBar({ stock, reorderLevel, maxStock, status }: {
  stock: number;
  reorderLevel: number;
  maxStock: number;
  status: StockStatus;
}) {
  const pct = Math.min((stock / maxStock) * 100, 100);
  const reorderPct = (reorderLevel / maxStock) * 100;
  return (
    <div className="relative w-28 h-2 rounded-full bg-secondary overflow-hidden">
      {/* Reorder marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
        style={{ left: `${reorderPct}%` }}
      />
      <div
        className={cn(
          "h-full rounded-full",
          status === "Critical" ? "bg-rose-500" : status === "Low" ? "bg-amber-400" : "bg-emerald-500"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const totalItems = INVENTORY_ITEMS.length;
  const okItems = INVENTORY_ITEMS.filter((i) => i.status === "OK").length;
  const lowItems = INVENTORY_ITEMS.filter((i) => i.status === "Low").length;
  const criticalItems = INVENTORY_ITEMS.filter((i) => i.status === "Critical").length;

  const filtered = INVENTORY_ITEMS.filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    return matchSearch && matchCategory;
  });

  const alertItems = INVENTORY_ITEMS.filter((i) => i.status !== "OK");

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: totalItems, color: "text-foreground" },
          { label: "In Stock (OK)", value: okItems, color: "text-emerald-600" },
          { label: "Low Stock", value: lowItems, color: "text-amber-600" },
          { label: "Critical", value: criticalItems, color: "text-rose-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shortage Alerts Panel */}
      {alertItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Shortage Alerts — Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertItems.map((item) => {
                const daysLeft = Math.floor(
                  (item.stock / item.monthlyUsage) * 30
                );
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      item.status === "Critical"
                        ? "bg-rose-50 border-rose-200"
                        : "bg-amber-50 border-amber-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={cn(
                          "h-4 w-4 shrink-0",
                          item.status === "Critical" ? "text-rose-500" : "text-amber-500"
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Vendor: {item.vendor}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          item.status === "Critical" ? "text-rose-600" : "text-amber-600"
                        )}
                      >
                        {item.stock} {item.unit} remaining
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ~{daysLeft} days left at current usage
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search item or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Raw Material", "Consumable", "Finished Goods"] as CategoryFilter[]).map(
            (c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                  category === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {c}
              </button>
            )
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder Lvl</TableHead>
                <TableHead>Monthly Usage</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    item.status === "Critical" && "bg-rose-50/40",
                    item.status === "Low" && "bg-amber-50/30"
                  )}
                >
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StockBar
                      stock={item.stock}
                      reorderLevel={item.reorderLevel}
                      maxStock={item.maxStock}
                      status={item.status}
                    />
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    {item.stock} {item.unit}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.reorderLevel} {item.unit}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.monthlyUsage} {item.unit}/mo
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.vendor}
                  </TableCell>
                  <TableCell>
                    <StockBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No items match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legend */}
      <p className="text-xs text-muted-foreground">
        * The vertical bar on the stock level indicator marks the reorder level. Items with stock below this bar need immediate attention.
      </p>
    </div>
  );
}
