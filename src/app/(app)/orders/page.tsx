"use client";

import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendLineChart } from "@/components/manufacturing/charts";
import {
  CUSTOMER_ORDERS,
  OTD_TREND,
  ORDER_STATS,
  type OrderStatus,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    "On Track": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "At Risk": "bg-amber-50 text-amber-700 border-amber-200",
    Delayed: "bg-rose-50 text-rose-700 border-rose-200",
    Completed: "bg-slate-50 text-slate-600 border-slate-200",
  };
  const icons: Record<OrderStatus, typeof CheckCircle2> = {
    "On Track": CheckCircle2,
    "At Risk": AlertTriangle,
    Delayed: XCircle,
    Completed: CheckCircle2,
  };
  const Icon = icons[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border", styles[status])}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const atRiskOrDelayed = CUSTOMER_ORDERS.filter(
    (o) => o.status === "At Risk" || o.status === "Delayed"
  );

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Orders", value: ORDER_STATS.totalOrders, color: "text-foreground" },
          { label: "On Track", value: ORDER_STATS.onTrack, color: "text-emerald-600" },
          { label: "At Risk", value: ORDER_STATS.atRisk, color: "text-amber-600" },
          { label: "Delayed", value: ORDER_STATS.delayed, color: "text-rose-600" },
          { label: "OTD %", value: `${ORDER_STATS.otdPercentage}%`, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {atRiskOrDelayed.length > 0 && (
        <div className="space-y-2">
          {atRiskOrDelayed.map((order) => (
            <div
              key={order.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border",
                order.status === "Delayed"
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              )}
            >
              {order.status === "Delayed" ? (
                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  {order.id} — {order.customer}
                </p>
                <p className="text-xs mt-0.5">
                  {order.product} · {order.qty} pcs · Due{" "}
                  {new Date(order.promisedDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}{" "}
                  · Contact: {order.contact}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OTD Trend + Order Value */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>On-Time Delivery Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart
              data={OTD_TREND}
              dataKey="otd"
              label="OTD %"
              domain={[70, 100]}
              formatter={(v) => `${v}%`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Order Value</p>
              <p className="text-2xl font-bold mt-1">
                ₹{(ORDER_STATS.totalValue / 100000).toFixed(2)}L
              </p>
            </div>
            <div className="space-y-2">
              {[
                { label: "On Track", count: ORDER_STATS.onTrack, color: "bg-emerald-500" },
                { label: "At Risk", count: ORDER_STATS.atRisk, color: "bg-amber-400" },
                { label: "Delayed", count: ORDER_STATS.delayed, color: "bg-rose-500" },
                { label: "Completed", count: ORDER_STATS.completed, color: "bg-slate-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", s.color)} />
                    <span className="text-muted-foreground">{s.label}</span>
                  </div>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Customer Orders</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Dispatched</TableHead>
                <TableHead>Promise Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CUSTOMER_ORDERS.map((order) => {
                const dispatchPct = Math.round((order.dispatchedQty / order.qty) * 100);
                return (
                  <TableRow
                    key={order.id}
                    className={cn(
                      order.status === "Delayed" && "bg-rose-50/40",
                      order.status === "At Risk" && "bg-amber-50/30"
                    )}
                  >
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell className="text-sm font-medium">{order.customer}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                      {order.product}
                    </TableCell>
                    <TableCell className="text-sm">{order.qty}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${dispatchPct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{order.dispatchedQty}</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn("text-sm", order.status === "Delayed" ? "text-rose-600 font-medium" : "text-muted-foreground")}>
                      {new Date(order.promisedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      ₹{(order.value / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.contact}</TableCell>
                    <TableCell><OrderStatusBadge status={order.status} /></TableCell>
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
