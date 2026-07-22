/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Typed service layer — all Supabase queries live here.
 * Pages import from this file instead of manufacturing-data.ts / data.ts.
 * Falls back to [] / null when Supabase is not configured (demo mode).
 */
import { supabase } from "@/lib/supabase";
import type {
  Machine,
  InventoryItem,
  PurchaseOrder,
  ProductionOrder,
  Operator,
  CustomerOrder,
  VisionAlert,
  CameraZone,
} from "@/lib/manufacturing-data";
import type { Lead, FollowUp, SiteVisit, TimelineEvent } from "@/lib/types";

// ── Manufacturing: Machines ───────────────────────────────────────────────────

export async function getMachines(): Promise<Machine[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("machines").select("*").order("id");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    status: r.status as Machine["status"],
    operator: r.operator,
    target: r.target,
    produced: r.produced,
    efficiency: r.efficiency,
    oee: r.oee,
    temperature: r.temperature,
    runtime: r.runtime,
    downtime: r.downtime,
    lastMaintenance: r.last_maintenance,
    shift: r.shift as "A" | "B",
    alerts: r.alerts ?? [],
  }));
}

export async function getMachine(id: string): Promise<Machine | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("machines")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  const r: any = data;
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    status: r.status as Machine["status"],
    operator: r.operator,
    target: r.target,
    produced: r.produced,
    efficiency: r.efficiency,
    oee: r.oee,
    temperature: r.temperature,
    runtime: r.runtime,
    downtime: r.downtime,
    lastMaintenance: r.last_maintenance,
    shift: r.shift as "A" | "B",
    alerts: r.alerts ?? [],
  };
}

export async function updateMachineStatus(id: string, status: Machine["status"]) {
  if (!supabase) return;
  await supabase
    .from("machines")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// ── Manufacturing: Inventory ──────────────────────────────────────────────────

export async function getInventoryItems(): Promise<InventoryItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("id");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    category: r.category as InventoryItem["category"],
    unit: r.unit,
    stock: r.stock,
    reorderLevel: r.reorder_level,
    maxStock: r.max_stock,
    monthlyUsage: r.monthly_usage,
    vendor: r.vendor,
    status: r.status as InventoryItem["status"],
  }));
}

export async function updateInventoryStock(id: string, stock: number) {
  if (!supabase) return;
  const status = stock <= 0 ? "Critical" : stock < 100 ? "Low" : "OK";
  await supabase
    .from("inventory_items")
    .update({ stock, status, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// ── Manufacturing: Purchase Orders ───────────────────────────────────────────

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("*")
    .order("ordered_date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    item: r.item,
    vendor: r.vendor,
    qty: r.qty,
    unit: r.unit,
    amount: r.amount,
    orderedDate: r.ordered_date,
    expectedDate: r.expected_date,
    status: r.status as PurchaseOrder["status"],
  }));
}

export async function updatePurchaseOrderStatus(
  id: string,
  status: PurchaseOrder["status"]
) {
  if (!supabase) return;
  await supabase
    .from("purchase_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// ── Manufacturing: Production Orders ─────────────────────────────────────────

export async function getProductionOrders(): Promise<ProductionOrder[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("production_orders")
    .select("*")
    .order("due_date");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    product: r.product,
    customer: r.customer,
    qty: r.qty,
    produced: r.produced,
    dueDate: r.due_date,
    status: r.status as ProductionOrder["status"],
    priority: r.priority as ProductionOrder["priority"],
    machine: r.machine,
  }));
}

export async function updateProductionOrderStatus(
  id: string,
  status: ProductionOrder["status"]
) {
  if (!supabase) return;
  await supabase
    .from("production_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function updateProductionOrderProduced(id: string, produced: number) {
  if (!supabase) return;
  await supabase
    .from("production_orders")
    .update({ produced, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// ── Manufacturing: Workforce ──────────────────────────────────────────────────

export async function getOperators(): Promise<Operator[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("operators")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    shift: r.shift as Operator["shift"],
    machine: r.machine,
    status: r.status as Operator["status"],
    attendance: r.attendance,
    productivity: r.productivity,
    overtime: r.overtime,
    safetyScore: r.safety_score,
  }));
}

// ── Manufacturing: Customer Orders ────────────────────────────────────────────

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("customer_orders")
    .select("*")
    .order("promised_date");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    customer: r.customer,
    product: r.product,
    qty: r.qty,
    dispatchedQty: r.dispatched_qty,
    orderDate: r.order_date,
    promisedDate: r.promised_date,
    status: r.status as CustomerOrder["status"],
    value: r.value,
    contact: r.contact,
  }));
}

export async function updateCustomerOrderStatus(
  id: string,
  status: CustomerOrder["status"]
) {
  if (!supabase) return;
  await supabase
    .from("customer_orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// ── Manufacturing: Defect Logs ────────────────────────────────────────────────

export interface DefectLog {
  id: string;
  time: string;
  machine: string;
  type: string;
  part: string;
  qty: number;
  action: string;
}

export async function getDefectLogs(): Promise<DefectLog[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("defect_logs")
    .select("*")
    .order("logged_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    time: r.time,
    machine: r.machine,
    type: r.type,
    part: r.part,
    qty: r.qty,
    action: r.action,
  }));
}

export async function addDefectLog(log: Omit<DefectLog, "id">) {
  if (!supabase) return;
  await supabase.from("defect_logs").insert({ id: `DL-${Date.now()}`, ...log });
}

// ── Manufacturing: Vision ─────────────────────────────────────────────────────

export async function getVisionAlerts(): Promise<VisionAlert[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("vision_alerts")
    .select("*")
    .order("alert_time", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    camera: r.camera,
    type: r.type as VisionAlert["type"],
    description: r.description,
    time: r.alert_time,
    severity: r.severity as VisionAlert["severity"],
    status: r.status as VisionAlert["status"],
  }));
}

export async function resolveVisionAlert(id: string) {
  if (!supabase) return;
  await supabase.from("vision_alerts").update({ status: "Resolved" }).eq("id", id);
}

export async function getCameraZones(): Promise<CameraZone[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("camera_zones")
    .select("*")
    .order("id");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    location: r.location,
    status: r.status as CameraZone["status"],
    ppeCompliance: r.ppe_compliance,
    lastAlert: r.last_alert ?? null,
    alertCount: r.alert_count,
  }));
}

// ── CRM: Leads ────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    location: r.location,
    source: r.source as Lead["source"],
    status: r.status as Lead["status"],
    assignedTo: r.assigned_to,
    enquiry: r.enquiry,
    lastFollowUp: r.last_follow_up ?? null,
    nextFollowUp: r.next_follow_up ?? null,
    createdAt: r.created_at,
    timeline: [],
  }));
}

export async function getLead(id: string): Promise<Lead | null> {
  if (!supabase) return null;
  const [{ data: leadData }, { data: tlData }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).single(),
    supabase.from("timeline_events").select("*").eq("lead_id", id).order("ts"),
  ]);
  if (!leadData) return null;
  const r: any = leadData;
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    location: r.location,
    source: r.source as Lead["source"],
    status: r.status as Lead["status"],
    assignedTo: r.assigned_to,
    enquiry: r.enquiry,
    lastFollowUp: r.last_follow_up ?? null,
    nextFollowUp: r.next_follow_up ?? null,
    createdAt: r.created_at,
    timeline: (tlData ?? []).map((t: any) => ({
      id: t.id,
      type: t.type as TimelineEvent["type"],
      title: t.title,
      description: t.description ?? undefined,
      timestamp: t.ts,
    })),
  };
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  if (!supabase) return;
  await supabase.from("leads").update({ status }).eq("id", id);
}

export async function addTimelineEvent(
  leadId: string,
  event: Omit<TimelineEvent, "id">
) {
  if (!supabase) return;
  await supabase.from("timeline_events").insert({
    id: `tl-${Date.now()}`,
    lead_id: leadId,
    type: event.type,
    title: event.title,
    description: event.description,
    ts: event.timestamp,
  });
}

// ── CRM: Follow-ups ───────────────────────────────────────────────────────────

export async function getFollowUps(): Promise<FollowUp[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("follow_ups")
    .select("*")
    .order("due_date");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    leadId: r.lead_id,
    leadName: r.lead_name,
    executive: r.executive,
    priority: r.priority as FollowUp["priority"],
    dueDate: r.due_date,
    status: r.status as FollowUp["status"],
    remarks: r.remarks ?? undefined,
  }));
}

export async function updateFollowUpStatus(id: string, status: FollowUp["status"]) {
  if (!supabase) return;
  await supabase.from("follow_ups").update({ status }).eq("id", id);
}

export async function addFollowUp(followUp: Omit<FollowUp, "id">) {
  if (!supabase) return;
  await supabase.from("follow_ups").insert({
    id: `fu-${Date.now()}`,
    lead_id: followUp.leadId,
    lead_name: followUp.leadName,
    executive: followUp.executive,
    priority: followUp.priority,
    due_date: followUp.dueDate,
    status: followUp.status,
    remarks: followUp.remarks,
  });
}

// ── CRM: Site Visits ──────────────────────────────────────────────────────────

export async function getSiteVisits(): Promise<SiteVisit[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("site_visits")
    .select("*")
    .order("date");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    leadId: r.lead_id,
    leadName: r.lead_name,
    date: r.date,
    executive: r.executive,
    status: r.status as SiteVisit["status"],
    remarks: r.remarks ?? undefined,
  }));
}

export async function updateSiteVisitStatus(
  id: string,
  status: SiteVisit["status"]
) {
  if (!supabase) return;
  await supabase.from("site_visits").update({ status }).eq("id", id);
}

export async function addSiteVisit(visit: Omit<SiteVisit, "id">) {
  if (!supabase) return;
  await supabase.from("site_visits").insert({
    id: `sv-${Date.now()}`,
    lead_id: visit.leadId,
    lead_name: visit.leadName,
    date: visit.date,
    executive: visit.executive,
    status: visit.status,
    remarks: visit.remarks,
  });
}
