"use client";

import { Camera, CheckCircle2, ShieldAlert, WifiOff, XCircle } from "lucide-react";
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
  CAMERA_ZONES,
  VISION_ALERTS,
  VISION_STATS,
  type AlertSeverity,
  type AlertStatus,
  type AlertType,
} from "@/lib/manufacturing-data";
import { cn } from "@/lib/utils";

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const styles: Record<AlertSeverity, string> = {
    High: "bg-rose-50 text-rose-700 border-rose-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border", styles[severity])}>
      {severity}
    </span>
  );
}

function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return status === "Open" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border bg-rose-50 text-rose-700 border-rose-200">
      <XCircle className="h-3 w-3" /> Open
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
      <CheckCircle2 className="h-3 w-3" /> Resolved
    </span>
  );
}

const ALERT_TYPE_COLORS: Record<AlertType, string> = {
  "PPE Violation": "bg-rose-50 text-rose-700 border-rose-200",
  "Machine Idle": "bg-amber-50 text-amber-700 border-amber-200",
  "Safety Violation": "bg-rose-50 text-rose-700 border-rose-200",
  "Intrusion": "bg-purple-50 text-purple-700 border-purple-200",
  "Fire/Smoke": "bg-rose-100 text-rose-800 border-rose-300",
  "Queue Build-up": "bg-blue-50 text-blue-700 border-blue-200",
};

function CameraCard({ zone }: { zone: typeof CAMERA_ZONES[0] }) {
  const isOffline = zone.status === "Offline";
  const hasAlerts = zone.alertCount > 0;

  return (
    <Card className={cn(isOffline && "border-rose-200", hasAlerts && !isOffline && "border-amber-200")}>
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* Mock camera feed */}
        <div
          className={cn(
            "relative w-full aspect-video rounded-lg flex items-center justify-center",
            isOffline ? "bg-slate-200" : "bg-slate-800"
          )}
        >
          {isOffline ? (
            <div className="text-center">
              <WifiOff className="h-8 w-8 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Camera Offline</p>
            </div>
          ) : (
            <>
              {/* Simulated CCTV overlay */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 to-slate-900/60" />
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] text-white font-mono">LIVE</span>
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] text-white/80 font-mono">
                  {zone.name}
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-white/60 font-mono">
                  21-06-26 · 13:42
                </div>
                {/* PPE compliance overlay */}
                <div
                  className={cn(
                    "absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold",
                    zone.ppeCompliance === 100
                      ? "bg-emerald-500/80 text-white"
                      : zone.ppeCompliance >= 90
                      ? "bg-amber-500/80 text-white"
                      : "bg-rose-500/80 text-white"
                  )}
                >
                  PPE {zone.ppeCompliance}%
                </div>
              </div>
              <Camera className="h-6 w-6 text-white/20" />
            </>
          )}
        </div>

        {/* Zone info */}
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{zone.name}</p>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded",
                isOffline ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
              )}
            >
              {isOffline ? <WifiOff className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
              {zone.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{zone.location}</p>
        </div>

        {zone.lastAlert && (
          <div className={cn("text-xs px-2 py-1.5 rounded flex items-start gap-1.5", isOffline ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-700")}>
            <ShieldAlert className="h-3 w-3 mt-0.5 shrink-0" />
            {zone.lastAlert}
          </div>
        )}

        {!zone.lastAlert && !isOffline && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> No active alerts
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function VisionPage() {
  const openAlerts = VISION_ALERTS.filter((a) => a.status === "Open");

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Cameras", value: VISION_STATS.totalCameras, color: "text-foreground" },
          { label: "Online", value: VISION_STATS.onlineCameras, color: "text-emerald-600" },
          { label: "Offline", value: VISION_STATS.totalCameras - VISION_STATS.onlineCameras, color: "text-rose-600" },
          { label: "PPE Violations", value: VISION_STATS.ppeViolationsToday, color: "text-rose-600" },
          { label: "Open Incidents", value: VISION_STATS.openIncidents, color: "text-amber-600" },
          { label: "Safety Score", value: `${VISION_STATS.overallSafetyScore}%`, color: VISION_STATS.overallSafetyScore >= 90 ? "text-emerald-600" : "text-amber-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-2xl font-bold mt-1", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Open alerts banner */}
      {openAlerts.length > 0 && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
          <p className="text-sm font-semibold text-rose-700 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            {openAlerts.length} open incident{openAlerts.length > 1 ? "s" : ""} requiring attention
          </p>
          <ul className="mt-2 space-y-1">
            {openAlerts.map((a) => (
              <li key={a.id} className="text-xs text-rose-600 flex items-start gap-1.5">
                <span className="mt-0.5">•</span>
                <span><strong>{a.type}</strong> — {a.description} ({a.camera})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Camera grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Live Camera Feeds</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAMERA_ZONES.map((zone) => (
            <CameraCard key={zone.id} zone={zone} />
          ))}
        </div>
      </div>

      {/* Alert log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Incident Log — Today</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Camera Zone</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VISION_ALERTS.map((alert) => (
                <TableRow
                  key={alert.id}
                  className={cn(
                    alert.status === "Open" && alert.severity === "High" && "bg-rose-50/40"
                  )}
                >
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {new Date(alert.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="text-sm">{alert.camera}</TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border", ALERT_TYPE_COLORS[alert.type])}>
                      {alert.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">
                    {alert.description}
                  </TableCell>
                  <TableCell><SeverityBadge severity={alert.severity} /></TableCell>
                  <TableCell><AlertStatusBadge status={alert.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
