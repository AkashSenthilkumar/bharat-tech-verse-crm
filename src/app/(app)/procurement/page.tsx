"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Search, Truck, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VendorPerformanceChart } from "@/components/manufacturing/charts";
import {
  PURCHASE_ORDERS,
  VENDOR_PERFORMANCE,
  type POStatus,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

function POStatusBadge({ status }: { status: POStatus }) {
  const styles: Record<POStatus, string> = {
    "Pending Approval": "bg-amber-50 text-amber-700 border-amber-200",
    "In Transit": "bg-blue-50 text-blue-700 border-blue-200",
    Delayed: "bg-rose-50 text-rose-700 border-rose-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-slate-50 text-slate-500 border-slate-200",
  };
  const icons: Record<POStatus, typeof Clock> = {
    "Pending Approval": Clock,
    "In Transit": Truck,
    Delayed: XCircle,
    Delivered: CheckCircle2,
    Cancelled: XCircle,
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

type StatusFilter = "All" | POStatus;

export default function ProcurementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const totalPOs = PURCHASE_ORDERS.length;
  const pendingApproval = PURCHASE_ORDERS.filter((po) => po.status === "Pending Approval").length;
  const delayed = PURCHASE_ORDERS.filter((po) => po.status === "Delayed").length;
  const inTransit = PURCHASE_ORDERS.filter((po) => po.status === "In Transit").length;
  const totalValue = PURCHASE_ORDERS.reduce((sum, po) => sum + po.amount, 0);

  const filtered = PURCHASE_ORDERS.filter((po) => {
    const matchSearch =
      !search ||
      po.item.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase()) ||
      po.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || po.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filterOptions: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "All" },
    { label: "Pending Approval", value: "Pending Approval" },
    { label: "In Transit", value: "In Transit" },
    { label: "Delayed", value: "Delayed" },
    { label: "Delivered", value: "Delivered" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total POs</p>
            <p className="text-2xl font-bold mt-1">{totalPOs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Pending Approval</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">{pendingApproval}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Delayed</p>
            <p className="text-2xl font-bold mt-1 text-rose-600">{delayed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Total PO Value</p>
            <p className="text-2xl font-bold mt-1">
              ₹{(totalValue / 100000).toFixed(1)}L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delayed PO alert */}
      {delayed > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {delayed} purchase order{delayed > 1 ? "s are" : " is"} delayed
            </p>
            <p className="text-xs mt-0.5">
              {PURCHASE_ORDERS.filter((po) => po.status === "Delayed")
                .map((po) => `${po.item} (${po.id})`)
                .join(", ")}{" "}
              — contact vendors immediately.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search item, vendor, or PO ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                statusFilter === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* PO Table */}
      <Card>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((po) => (
                <TableRow
                  key={po.id}
                  className={cn(
                    po.status === "Delayed" && "bg-rose-50/40",
                    po.status === "Pending Approval" && "bg-amber-50/30"
                  )}
                >
                  <TableCell className="font-mono text-sm">{po.id}</TableCell>
                  <TableCell className="text-sm font-medium">{po.item}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{po.vendor}</TableCell>
                  <TableCell className="text-sm">
                    {po.qty.toLocaleString()} {po.unit}
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    ₹{po.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(po.orderedDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-sm",
                      po.status === "Delayed" ? "text-rose-600 font-medium" : "text-muted-foreground"
                    )}
                  >
                    {new Date(po.expectedDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    <POStatusBadge status={po.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No purchase orders match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vendor Performance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Vendor Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorPerformanceChart data={VENDOR_PERFORMANCE} />
        </CardContent>
      </Card>

      {/* Vendor table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Vendor Scorecard</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>On-Time Delivery</TableHead>
                <TableHead>Quality Score</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VENDOR_PERFORMANCE.map((v) => {
                const avg = Math.round((v.onTime + v.quality) / 2);
                const rating =
                  avg >= 90 ? "Preferred" : avg >= 75 ? "Approved" : "Watch List";
                const ratingStyle =
                  avg >= 90
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : avg >= 75
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-rose-50 text-rose-700 border-rose-200";
                return (
                  <TableRow key={v.vendor}>
                    <TableCell className="font-medium text-sm">{v.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              v.onTime >= 90 ? "bg-emerald-500" : v.onTime >= 75 ? "bg-primary" : "bg-rose-400"
                            )}
                            style={{ width: `${v.onTime}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{v.onTime}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${v.quality}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{v.quality}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
                          ratingStyle
                        )}
                      >
                        {rating}
                      </span>
                    </TableCell>
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
