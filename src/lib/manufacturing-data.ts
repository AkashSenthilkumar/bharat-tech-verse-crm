export type MachineStatus = "Running" | "Stopped" | "Maintenance";
export type StockStatus = "OK" | "Low" | "Critical";
export type POStatus = "Pending Approval" | "In Transit" | "Delayed" | "Delivered" | "Cancelled";
export type ProductionOrderStatus = "Planned" | "In Progress" | "Completed" | "At Risk";
export type Priority = "High" | "Medium" | "Low";

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  operator: string;
  target: number;
  produced: number;
  efficiency: number;
  oee: number;
  temperature: number;
  runtime: string;
  downtime: string;
  lastMaintenance: string;
  shift: "A" | "B";
  alerts: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Raw Material" | "Consumable" | "Finished Goods";
  unit: string;
  stock: number;
  reorderLevel: number;
  maxStock: number;
  monthlyUsage: number;
  vendor: string;
  status: StockStatus;
}

export interface PurchaseOrder {
  id: string;
  item: string;
  vendor: string;
  qty: number;
  unit: string;
  amount: number;
  orderedDate: string;
  expectedDate: string;
  status: POStatus;
}

export interface ProductionOrder {
  id: string;
  product: string;
  customer: string;
  qty: number;
  produced: number;
  dueDate: string;
  status: ProductionOrderStatus;
  priority: Priority;
  machine: string;
}

export const MACHINES: Machine[] = [
  {
    id: "m1", name: "CNC Lathe 1", type: "CNC Lathe", status: "Running",
    operator: "Rajesh Kumar", target: 120, produced: 108, efficiency: 90, oee: 85,
    temperature: 42, runtime: "6h 20m", downtime: "0m",
    lastMaintenance: "2026-06-15", shift: "A", alerts: [],
  },
  {
    id: "m2", name: "CNC Lathe 2", type: "CNC Lathe", status: "Running",
    operator: "Murugan S", target: 120, produced: 95, efficiency: 79, oee: 72,
    temperature: 38, runtime: "5h 45m", downtime: "35m",
    lastMaintenance: "2026-06-18", shift: "A", alerts: ["Cycle time 18% above average"],
  },
  {
    id: "m3", name: "Milling Machine 1", type: "Milling", status: "Running",
    operator: "Selvam R", target: 80, produced: 76, efficiency: 95, oee: 91,
    temperature: 45, runtime: "6h 10m", downtime: "0m",
    lastMaintenance: "2026-06-10", shift: "A", alerts: [],
  },
  {
    id: "m4", name: "Milling Machine 2", type: "Milling", status: "Stopped",
    operator: "Arun K", target: 80, produced: 32, efficiency: 40, oee: 28,
    temperature: 0, runtime: "2h 10m", downtime: "4h 10m",
    lastMaintenance: "2026-05-28", shift: "A",
    alerts: ["Breakdown — spindle bearing failure", "Maintenance requested at 09:45"],
  },
  {
    id: "m5", name: "Drilling Machine", type: "Drilling", status: "Running",
    operator: "Karthik P", target: 200, produced: 188, efficiency: 94, oee: 89,
    temperature: 35, runtime: "6h 20m", downtime: "0m",
    lastMaintenance: "2026-06-20", shift: "A", alerts: [],
  },
  {
    id: "m6", name: "Grinding Machine", type: "Grinding", status: "Running",
    operator: "Suresh M", target: 150, produced: 140, efficiency: 93, oee: 88,
    temperature: 48, runtime: "6h 00m", downtime: "20m",
    lastMaintenance: "2026-06-12", shift: "A", alerts: [],
  },
  {
    id: "m7", name: "Hydraulic Press", type: "Press", status: "Maintenance",
    operator: "Vijay T", target: 100, produced: 45, efficiency: 45, oee: 32,
    temperature: 0, runtime: "3h 00m", downtime: "3h 20m",
    lastMaintenance: "2026-06-21", shift: "A",
    alerts: ["Scheduled PM — hydraulic seal replacement"],
  },
  {
    id: "m8", name: "Surface Grinder", type: "Grinding", status: "Running",
    operator: "Bala N", target: 90, produced: 85, efficiency: 94, oee: 90,
    temperature: 40, runtime: "6h 15m", downtime: "5m",
    lastMaintenance: "2026-06-08", shift: "B", alerts: [],
  },
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: "inv-1", name: "MS Rods (25mm)", category: "Raw Material", unit: "kg", stock: 850, reorderLevel: 500, maxStock: 2000, monthlyUsage: 1200, vendor: "Coimbatore Steel Traders", status: "OK" },
  { id: "inv-2", name: "Aluminum Billets", category: "Raw Material", unit: "kg", stock: 180, reorderLevel: 300, maxStock: 1000, monthlyUsage: 450, vendor: "Annamalai Metals", status: "Low" },
  { id: "inv-3", name: "Cast Iron Blocks", category: "Raw Material", unit: "pcs", stock: 42, reorderLevel: 50, maxStock: 200, monthlyUsage: 80, vendor: "Salem Alloys", status: "Low" },
  { id: "inv-4", name: "Brass Rods (20mm)", category: "Raw Material", unit: "kg", stock: 620, reorderLevel: 200, maxStock: 800, monthlyUsage: 350, vendor: "Coimbatore Steel Traders", status: "OK" },
  { id: "inv-5", name: "SS Sheets (2mm)", category: "Raw Material", unit: "kg", stock: 95, reorderLevel: 150, maxStock: 500, monthlyUsage: 200, vendor: "Chennai Steel Corp", status: "Critical" },
  { id: "inv-6", name: "Carbide Inserts", category: "Consumable", unit: "pcs", stock: 280, reorderLevel: 100, maxStock: 500, monthlyUsage: 180, vendor: "Tool Mart CBE", status: "OK" },
  { id: "inv-7", name: "Coolant Oil", category: "Consumable", unit: "liters", stock: 450, reorderLevel: 200, maxStock: 1000, monthlyUsage: 300, vendor: "Lubri Corp", status: "OK" },
  { id: "inv-8", name: "Engine Brackets (FG)", category: "Finished Goods", unit: "pcs", stock: 320, reorderLevel: 100, maxStock: 600, monthlyUsage: 400, vendor: "—", status: "OK" },
  { id: "inv-9", name: "Gear Housings (FG)", category: "Finished Goods", unit: "pcs", stock: 85, reorderLevel: 50, maxStock: 300, monthlyUsage: 200, vendor: "—", status: "OK" },
  { id: "inv-10", name: "Pump Bodies (FG)", category: "Finished Goods", unit: "pcs", stock: 35, reorderLevel: 40, maxStock: 150, monthlyUsage: 80, vendor: "—", status: "Low" },
];

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "PO-2024-001", item: "Aluminum Billets", vendor: "Annamalai Metals", qty: 500, unit: "kg", amount: 87500, orderedDate: "2026-06-18", expectedDate: "2026-06-24", status: "In Transit" },
  { id: "PO-2024-002", item: "SS Sheets (2mm)", vendor: "Chennai Steel Corp", qty: 300, unit: "kg", amount: 54000, orderedDate: "2026-06-19", expectedDate: "2026-06-25", status: "Pending Approval" },
  { id: "PO-2024-003", item: "Cast Iron Blocks", vendor: "Salem Alloys", qty: 100, unit: "pcs", amount: 35000, orderedDate: "2026-06-15", expectedDate: "2026-06-22", status: "Delayed" },
  { id: "PO-2024-004", item: "Carbide Inserts", vendor: "Tool Mart CBE", qty: 200, unit: "pcs", amount: 18000, orderedDate: "2026-06-20", expectedDate: "2026-06-23", status: "Delivered" },
  { id: "PO-2024-005", item: "MS Rods (25mm)", vendor: "Coimbatore Steel Traders", qty: 1000, unit: "kg", amount: 65000, orderedDate: "2026-06-21", expectedDate: "2026-06-28", status: "Pending Approval" },
  { id: "PO-2024-006", item: "Coolant Oil", vendor: "Lubri Corp", qty: 400, unit: "liters", amount: 12000, orderedDate: "2026-06-14", expectedDate: "2026-06-20", status: "Delivered" },
  { id: "PO-2024-007", item: "Brass Rods (20mm)", vendor: "Coimbatore Steel Traders", qty: 200, unit: "kg", amount: 28000, orderedDate: "2026-06-17", expectedDate: "2026-06-26", status: "In Transit" },
];

export const PRODUCTION_ORDERS: ProductionOrder[] = [
  { id: "WO-1001", product: "Engine Bracket (EB-201)", customer: "Ashok Leyland", qty: 500, produced: 420, dueDate: "2026-06-25", status: "In Progress", priority: "High", machine: "CNC Lathe 1" },
  { id: "WO-1002", product: "Gear Housing (GH-305)", customer: "TVS Motors", qty: 300, produced: 300, dueDate: "2026-06-22", status: "Completed", priority: "High", machine: "Milling Machine 1" },
  { id: "WO-1003", product: "Shaft Assembly (SA-108)", customer: "Bosch India", qty: 200, produced: 148, dueDate: "2026-06-28", status: "In Progress", priority: "Medium", machine: "CNC Lathe 2" },
  { id: "WO-1004", product: "Bearing Housing (BH-422)", customer: "SKF India", qty: 150, produced: 0, dueDate: "2026-07-05", status: "Planned", priority: "Low", machine: "Milling Machine 2" },
  { id: "WO-1005", product: "Pump Body (PB-510)", customer: "Grundfos India", qty: 80, produced: 35, dueDate: "2026-06-24", status: "At Risk", priority: "High", machine: "Hydraulic Press" },
  { id: "WO-1006", product: "Engine Bracket (EB-201)", customer: "Tata Motors", qty: 400, produced: 0, dueDate: "2026-07-10", status: "Planned", priority: "Medium", machine: "CNC Lathe 1" },
];

export const WEEKLY_PRODUCTION = [
  { day: "Mon", target: 800, actual: 742 },
  { day: "Tue", target: 800, actual: 818 },
  { day: "Wed", target: 800, actual: 756 },
  { day: "Thu", target: 800, actual: 801 },
  { day: "Fri", target: 800, actual: 769 },
  { day: "Sat", target: 400, actual: 380 },
  { day: "Today", target: 800, actual: 569 },
];

export const OEE_TREND = [
  { week: "W20", oee: 72 },
  { week: "W21", oee: 75 },
  { week: "W22", oee: 71 },
  { week: "W23", oee: 78 },
  { week: "W24", oee: 74 },
  { week: "W25", oee: 78 },
];

export const VENDOR_PERFORMANCE = [
  { vendor: "CBE Steel", onTime: 92, quality: 96 },
  { vendor: "Annamalai", onTime: 78, quality: 88 },
  { vendor: "Chennai Steel", onTime: 65, quality: 90 },
  { vendor: "Salem Alloys", onTime: 55, quality: 82 },
  { vendor: "Tool Mart", onTime: 98, quality: 99 },
];

export const SHIFT_PERFORMANCE = [
  { shift: "Shift A (06:00–14:00)", target: 1600, actual: 1428, operators: 12, rejections: 23, oee: 78 },
  { shift: "Shift B (14:00–22:00)", target: 1200, actual: 985, operators: 9, rejections: 18, oee: 72 },
  { shift: "Shift C (22:00–06:00)", target: 400, actual: 427, operators: 5, rejections: 8, oee: 84 },
];

export const FACTORY_STATS = {
  todayTarget: 3200,
  todayProduced: 2840,
  oee: 78,
  machinesRunning: 6,
  machinesTotal: 8,
  inventoryAlerts: 4,
  activeOrders: 4,
  atRiskOrders: 1,
  rejectionRate: 2.8,
  scrapRate: 1.2,
  totalOperators: 26,
};
