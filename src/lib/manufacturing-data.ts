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

// ─── Quality Intelligence ────────────────────────────────────────────────────

export const DEFECT_TYPES = [
  { type: "Dimensional Error", count: 42, percentage: 35 },
  { type: "Surface Defect", count: 28, percentage: 23 },
  { type: "Tool Wear Mark", count: 22, percentage: 18 },
  { type: "Burr / Flash", count: 18, percentage: 15 },
  { type: "Others", count: 11, percentage: 9 },
];

export const FPY_TREND = [
  { week: "W20", fpy: 94.2 },
  { week: "W21", fpy: 95.1 },
  { week: "W22", fpy: 93.8 },
  { week: "W23", fpy: 96.2 },
  { week: "W24", fpy: 95.8 },
  { week: "W25", fpy: 97.2 },
];

export const REJECTION_BY_MACHINE = [
  { machine: "CNC Lathe 1", rejected: 12, inspected: 108 },
  { machine: "CNC Lathe 2", rejected: 18, inspected: 95 },
  { machine: "Milling M/C 1", rejected: 4, inspected: 76 },
  { machine: "Milling M/C 2", rejected: 22, inspected: 32 },
  { machine: "Drilling", rejected: 8, inspected: 188 },
  { machine: "Grinding", rejected: 5, inspected: 140 },
  { machine: "Hydr. Press", rejected: 10, inspected: 45 },
  { machine: "Surf. Grinder", rejected: 3, inspected: 85 },
];

export const DEFECT_LOG = [
  { id: "DL-01", time: "11:42", machine: "CNC Lathe 2", type: "Dimensional Error", part: "Shaft Assembly", qty: 4, action: "Operator alerted, tool changed" },
  { id: "DL-02", time: "10:15", machine: "Milling M/C 2", type: "Surface Defect", part: "Gear Housing", qty: 8, action: "Machine stopped for inspection" },
  { id: "DL-03", time: "09:30", machine: "Hydr. Press", type: "Burr / Flash", part: "Engine Bracket", qty: 6, action: "Rework initiated" },
  { id: "DL-04", time: "08:55", machine: "CNC Lathe 1", type: "Tool Wear Mark", part: "Engine Bracket", qty: 3, action: "Insert replaced" },
  { id: "DL-05", time: "08:10", machine: "Grinding", type: "Dimensional Error", part: "Bearing Housing", qty: 2, action: "Grinding wheel dressed" },
];

export const QUALITY_STATS = {
  totalInspected: 769,
  totalPassed: 687,
  totalRejected: 82,
  reworked: 34,
  scrapped: 48,
  fpy: 97.2,
  rejectionRate: 2.8,
  scrapRate: 1.2,
};

// ─── Workforce Intelligence ───────────────────────────────────────────────────

export type OperatorStatus = "Present" | "Absent" | "On Leave";

export interface Operator {
  id: string;
  name: string;
  role: string;
  shift: "A" | "B" | "C";
  machine: string;
  status: OperatorStatus;
  attendance: number;
  productivity: number;
  overtime: number;
  safetyScore: number;
}

export const OPERATORS: Operator[] = [
  { id: "op1", name: "Rajesh Kumar", role: "CNC Operator", shift: "A", machine: "CNC Lathe 1", status: "Present", attendance: 96, productivity: 90, overtime: 4, safetyScore: 98 },
  { id: "op2", name: "Murugan S", role: "CNC Operator", shift: "A", machine: "CNC Lathe 2", status: "Present", attendance: 88, productivity: 79, overtime: 2, safetyScore: 95 },
  { id: "op3", name: "Selvam R", role: "Milling Operator", shift: "A", machine: "Milling M/C 1", status: "Present", attendance: 98, productivity: 95, overtime: 0, safetyScore: 100 },
  { id: "op4", name: "Arun K", role: "Milling Operator", shift: "A", machine: "Milling M/C 2", status: "Present", attendance: 82, productivity: 40, overtime: 0, safetyScore: 90 },
  { id: "op5", name: "Karthik P", role: "Drill Operator", shift: "A", machine: "Drilling Machine", status: "Present", attendance: 97, productivity: 94, overtime: 6, safetyScore: 97 },
  { id: "op6", name: "Suresh M", role: "Grinding Operator", shift: "A", machine: "Grinding Machine", status: "Present", attendance: 94, productivity: 93, overtime: 3, safetyScore: 99 },
  { id: "op7", name: "Vijay T", role: "Press Operator", shift: "A", machine: "Hydraulic Press", status: "Present", attendance: 91, productivity: 45, overtime: 0, safetyScore: 88 },
  { id: "op8", name: "Bala N", role: "Grinder Operator", shift: "B", machine: "Surface Grinder", status: "Present", attendance: 95, productivity: 94, overtime: 5, safetyScore: 96 },
  { id: "op9", name: "Ganesh V", role: "QC Inspector", shift: "A", machine: "QC Station", status: "Present", attendance: 99, productivity: 98, overtime: 2, safetyScore: 100 },
  { id: "op10", name: "Praveen R", role: "CNC Operator", shift: "B", machine: "CNC Lathe 1", status: "Absent", attendance: 72, productivity: 0, overtime: 0, safetyScore: 85 },
  { id: "op11", name: "Senthil K", role: "Material Handler", shift: "A", machine: "Stores", status: "Present", attendance: 96, productivity: 92, overtime: 1, safetyScore: 94 },
  { id: "op12", name: "Durai S", role: "Maintenance Tech", shift: "A", machine: "General", status: "On Leave", attendance: 89, productivity: 0, overtime: 0, safetyScore: 92 },
];

export const ATTENDANCE_TREND = [
  { day: "Mon", present: 24, absent: 2, leave: 0 },
  { day: "Tue", present: 25, absent: 1, leave: 0 },
  { day: "Wed", present: 23, absent: 2, leave: 1 },
  { day: "Thu", present: 24, absent: 1, leave: 1 },
  { day: "Fri", present: 22, absent: 3, leave: 1 },
  { day: "Sat", present: 20, absent: 0, leave: 0 },
  { day: "Today", present: 22, absent: 2, leave: 2 },
];

export const WORKFORCE_STATS = {
  totalOperators: 26,
  presentToday: 22,
  absentToday: 2,
  onLeave: 2,
  overtimeHoursThisWeek: 34,
  avgAttendance: 92,
  avgProductivity: 81,
  avgSafetyScore: 95,
};

// ─── Order Intelligence ───────────────────────────────────────────────────────

export type OrderStatus = "On Track" | "At Risk" | "Delayed" | "Completed";

export interface CustomerOrder {
  id: string;
  customer: string;
  product: string;
  qty: number;
  dispatchedQty: number;
  orderDate: string;
  promisedDate: string;
  status: OrderStatus;
  value: number;
  contact: string;
}

export const CUSTOMER_ORDERS: CustomerOrder[] = [
  { id: "SO-5001", customer: "Ashok Leyland", product: "Engine Bracket (EB-201)", qty: 500, dispatchedQty: 0, orderDate: "2026-06-01", promisedDate: "2026-06-25", status: "On Track", value: 375000, contact: "Ramesh M" },
  { id: "SO-5002", customer: "TVS Motors", product: "Gear Housing (GH-305)", qty: 300, dispatchedQty: 300, orderDate: "2026-05-28", promisedDate: "2026-06-22", status: "Completed", value: 210000, contact: "Priya K" },
  { id: "SO-5003", customer: "Bosch India", product: "Shaft Assembly (SA-108)", qty: 200, dispatchedQty: 0, orderDate: "2026-06-05", promisedDate: "2026-06-28", status: "On Track", value: 160000, contact: "Anand S" },
  { id: "SO-5004", customer: "SKF India", product: "Bearing Housing (BH-422)", qty: 150, dispatchedQty: 0, orderDate: "2026-06-10", promisedDate: "2026-07-05", status: "On Track", value: 127500, contact: "Vijay R" },
  { id: "SO-5005", customer: "Grundfos India", product: "Pump Body (PB-510)", qty: 80, dispatchedQty: 0, orderDate: "2026-06-08", promisedDate: "2026-06-24", status: "At Risk", value: 144000, contact: "Meena P" },
  { id: "SO-5006", customer: "Tata Motors", product: "Engine Bracket (EB-201)", qty: 400, dispatchedQty: 0, orderDate: "2026-06-15", promisedDate: "2026-07-10", status: "On Track", value: 300000, contact: "Kumar V" },
  { id: "SO-5007", customer: "Mahindra & Mahindra", product: "Shaft Assembly (SA-108)", qty: 100, dispatchedQty: 20, orderDate: "2026-06-12", promisedDate: "2026-06-28", status: "Delayed", value: 80000, contact: "Suresh B" },
];

export const OTD_TREND = [
  { month: "Jan", otd: 82 },
  { month: "Feb", otd: 85 },
  { month: "Mar", otd: 88 },
  { month: "Apr", otd: 84 },
  { month: "May", otd: 91 },
  { month: "Jun", otd: 87 },
];

export const ORDER_STATS = {
  totalOrders: 7,
  onTrack: 4,
  atRisk: 1,
  delayed: 1,
  completed: 1,
  totalValue: 1396500,
  otdPercentage: 87,
};

// ─── Finance Intelligence ─────────────────────────────────────────────────────

export const COST_BREAKDOWN = [
  { category: "Raw Material", amount: 420000, percentage: 58 },
  { category: "Labour", amount: 115000, percentage: 16 },
  { category: "Energy", amount: 58000, percentage: 8 },
  { category: "Overhead", amount: 72500, percentage: 10 },
  { category: "Maintenance", amount: 58000, percentage: 8 },
];

export const MONTHLY_PROFITABILITY = [
  { month: "Jan", revenue: 850000, cost: 680000, profit: 170000 },
  { month: "Feb", revenue: 920000, cost: 720000, profit: 200000 },
  { month: "Mar", revenue: 1050000, cost: 810000, profit: 240000 },
  { month: "Apr", revenue: 980000, cost: 780000, profit: 200000 },
  { month: "May", revenue: 1120000, cost: 850000, profit: 270000 },
  { month: "Jun", revenue: 1396500, cost: 723500, profit: 673000 },
];

export const PRODUCT_MARGINS = [
  { product: "Engine Bracket (EB-201)", unitCost: 650, unitPrice: 875, margin: 25.7, volume: 900 },
  { product: "Gear Housing (GH-305)", unitCost: 580, unitPrice: 700, margin: 17.1, volume: 300 },
  { product: "Shaft Assembly (SA-108)", unitCost: 520, unitPrice: 800, margin: 35.0, volume: 300 },
  { product: "Bearing Housing (BH-422)", unitCost: 680, unitPrice: 850, margin: 20.0, volume: 150 },
  { product: "Pump Body (PB-510)", unitCost: 1400, unitPrice: 1800, margin: 22.2, volume: 80 },
];

export const FINANCE_STATS = {
  revenueThisMonth: 1396500,
  totalCost: 723500,
  grossProfit: 673000,
  grossMargin: 48.2,
  materialCostPct: 58,
  revenueGrowth: 24.7,
};

// ─── Energy Intelligence ──────────────────────────────────────────────────────

export const HOURLY_ENERGY = [
  { hour: "06:00", kwh: 42 },
  { hour: "07:00", kwh: 78 },
  { hour: "08:00", kwh: 95 },
  { hour: "09:00", kwh: 102 },
  { hour: "10:00", kwh: 98 },
  { hour: "11:00", kwh: 105 },
  { hour: "12:00", kwh: 88 },
  { hour: "13:00", kwh: 72 },
  { hour: "14:00", kwh: 95 },
  { hour: "15:00", kwh: 108 },
  { hour: "16:00", kwh: 112 },
  { hour: "17:00", kwh: 98 },
  { hour: "18:00", kwh: 45 },
];

export const WEEKLY_ENERGY = [
  { day: "Mon", electricity: 850, water: 12000 },
  { day: "Tue", electricity: 920, water: 13500 },
  { day: "Wed", electricity: 880, water: 11800 },
  { day: "Thu", electricity: 910, water: 12500 },
  { day: "Fri", electricity: 870, water: 11200 },
  { day: "Sat", electricity: 420, water: 6500 },
  { day: "Today", electricity: 580, water: 8200 },
];

export const MACHINE_ENERGY = [
  { machine: "Milling M/C 1", kwh: 22.4 },
  { machine: "CNC Lathe 1", kwh: 18.5 },
  { machine: "CNC Lathe 2", kwh: 17.2 },
  { machine: "Grinding", kwh: 15.6 },
  { machine: "Surf. Grinder", kwh: 14.2 },
  { machine: "Drilling", kwh: 12.8 },
  { machine: "Hydr. Press", kwh: 9.3 },
  { machine: "Milling M/C 2", kwh: 8.1 },
];

export const ENERGY_STATS = {
  todayKwh: 580,
  weeklyKwh: 5430,
  peakDemandKw: 112,
  todayCost: 4640,
  weeklyCost: 43440,
  waterToday: 8200,
  carbonThisMonth: 2.4,
};

// ─── Factory Vision Intelligence ──────────────────────────────────────────────

export type CameraStatus = "Online" | "Offline";
export type AlertType = "PPE Violation" | "Machine Idle" | "Safety Violation" | "Intrusion" | "Fire/Smoke" | "Queue Build-up";
export type AlertSeverity = "High" | "Medium" | "Low";
export type AlertStatus = "Open" | "Resolved";

export interface CameraZone {
  id: string;
  name: string;
  location: string;
  status: CameraStatus;
  ppeCompliance: number;
  lastAlert: string | null;
  alertCount: number;
}

export interface VisionAlert {
  id: string;
  camera: string;
  type: AlertType;
  description: string;
  time: string;
  severity: AlertSeverity;
  status: AlertStatus;
}

export const CAMERA_ZONES: CameraZone[] = [
  { id: "cam1", name: "Zone A — CNC Area", location: "Shop Floor North", status: "Online", ppeCompliance: 94, lastAlert: "Helmet not worn", alertCount: 2 },
  { id: "cam2", name: "Zone B — Milling Area", location: "Shop Floor Centre", status: "Online", ppeCompliance: 100, lastAlert: null, alertCount: 0 },
  { id: "cam3", name: "Zone C — Grinding Area", location: "Shop Floor South", status: "Online", ppeCompliance: 88, lastAlert: "Safety glasses violation", alertCount: 3 },
  { id: "cam4", name: "Zone D — Press Area", location: "Shop Floor East", status: "Offline", ppeCompliance: 0, lastAlert: "Camera offline since 10:20", alertCount: 1 },
  { id: "cam5", name: "Zone E — Entry Gate", location: "Factory Entrance", status: "Online", ppeCompliance: 100, lastAlert: null, alertCount: 0 },
  { id: "cam6", name: "Zone F — Stores", location: "Inventory Area", status: "Online", ppeCompliance: 96, lastAlert: null, alertCount: 1 },
];

export const VISION_ALERTS: VisionAlert[] = [
  { id: "va1", camera: "Zone A — CNC Area", type: "PPE Violation", description: "Operator without helmet near CNC Lathe 1", time: "2026-06-21T08:42:00", severity: "High", status: "Open" },
  { id: "va2", camera: "Zone C — Grinding Area", type: "PPE Violation", description: "Safety glasses not worn at grinding station", time: "2026-06-21T09:15:00", severity: "High", status: "Open" },
  { id: "va3", camera: "Zone A — CNC Area", type: "Machine Idle", description: "CNC Lathe 2 idle for more than 30 minutes", time: "2026-06-21T07:30:00", severity: "Medium", status: "Resolved" },
  { id: "va4", camera: "Zone D — Press Area", type: "Safety Violation", description: "Camera offline — blind spot in press area", time: "2026-06-21T10:20:00", severity: "High", status: "Open" },
  { id: "va5", camera: "Zone C — Grinding Area", type: "Queue Build-up", description: "WIP queue exceeding 50 units at grinding output", time: "2026-06-21T11:05:00", severity: "Medium", status: "Open" },
  { id: "va6", camera: "Zone F — Stores", type: "Intrusion", description: "Unauthorised entry detected in restricted stores area", time: "2026-06-21T06:58:00", severity: "High", status: "Resolved" },
];

export const VISION_STATS = {
  totalCameras: 6,
  onlineCameras: 5,
  ppeViolationsToday: 3,
  openIncidents: 4,
  overallSafetyScore: 82,
  avgPpeCompliance: 88,
};
