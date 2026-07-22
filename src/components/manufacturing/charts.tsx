"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.1)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export function WeeklyProductionChart({
  data,
}: {
  data: { day: string; target: number; actual: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={3} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
        <Bar dataKey="actual" name="Actual" fill="#b8860b" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OeeTrendChart({
  data,
}: {
  data: { week: string; oee: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          domain={[60, 100]}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, "OEE"]}
          contentStyle={TOOLTIP_STYLE}
        />
        <Line
          type="monotone"
          dataKey="oee"
          stroke="#b8860b"
          strokeWidth={2.5}
          dot={{ fill: "#b8860b", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const MACHINE_COLORS: Record<string, string> = {
  Running: "#10b981",
  Stopped: "#f43f5e",
  Maintenance: "#f59e0b",
};

export function MachineStatusDonut({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={MACHINE_COLORS[entry.name] ?? "#94a3b8"} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function VendorPerformanceChart({
  data,
}: {
  data: { vendor: string; onTime: number; quality: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" barGap={2} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="vendor"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={88}
        />
        <Tooltip
          formatter={(v) => [`${v}%`]}
          contentStyle={TOOLTIP_STYLE}
        />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="onTime" name="On-Time %" fill="#b8860b" radius={[0, 3, 3, 0]} barSize={9} />
        <Bar dataKey="quality" name="Quality %" fill="#3b82f6" radius={[0, 3, 3, 0]} barSize={9} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Generic single-line trend chart (OEE, FPY, OTD, etc.)
export function TrendLineChart({
  data,
  dataKey,
  label,
  color = "#b8860b",
  domain,
  formatter,
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  label: string;
  color?: string;
  domain?: [number, number];
  formatter?: (v: number) => string;
}) {
  const xKey = Object.keys(data[0] ?? {}).find((k) => k !== dataKey) ?? "x";
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          domain={domain}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatter ?? ((v) => String(v))}
        />
        <Tooltip
          formatter={(v) => [formatter ? formatter(v as number) : v, label]}
          contentStyle={TOOLTIP_STYLE}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.5}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Generic simple pie chart
const PIE_COLORS = ["#b8860b", "#3b82f6", "#10b981", "#f59e0b", "#94a3b8", "#f43f5e"];

export function SimplePieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Rejection by machine bar chart
export function RejectionByMachineChart({
  data,
}: {
  data: { machine: string; rejected: number; inspected: number }[];
}) {
  const chartData = data.map((d) => ({
    ...d,
    rejectionRate: +((d.rejected / d.inspected) * 100).toFixed(1),
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="machine" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={96} />
        <Tooltip formatter={(v) => [`${v}%`, "Rejection Rate"]} contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="rejectionRate" name="Rejection Rate %" fill="#f43f5e" radius={[0, 3, 3, 0]} barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Stacked attendance bar chart
export function AttendanceTrendChart({
  data,
}: {
  data: { day: string; present: number; absent: number; leave: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="present" name="Present" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
        <Bar dataKey="absent" name="Absent" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
        <Bar dataKey="leave" name="On Leave" stackId="a" fill="#f59e0b" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Profitability combined chart (revenue + cost bars, profit line)
export function ProfitabilityChart({
  data,
}: {
  data: { month: string; revenue: number; cost: number; profit: number }[];
}) {
  const fmt = (v: number) => `₹${(v / 100000).toFixed(1)}L`;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barGap={3} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={fmt} />
        <Tooltip formatter={(v) => [fmt(v as number)]} contentStyle={TOOLTIP_STYLE} />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="revenue" name="Revenue" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
        <Bar dataKey="cost" name="Cost" fill="#fca5a5" radius={[3, 3, 0, 0]} />
        <Bar dataKey="profit" name="Profit" fill="#b8860b" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Hourly energy bar chart
export function HourlyEnergyChart({
  data,
}: {
  data: { hour: string; kwh: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v) => [`${v} kWh`, "Consumption"]} contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="kwh" name="kWh" fill="#b8860b" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Machine energy horizontal bar
export function MachineEnergyChart({
  data,
}: {
  data: { machine: string; kwh: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} kWh`} />
        <YAxis type="category" dataKey="machine" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={96} />
        <Tooltip formatter={(v) => [`${v} kWh`, "Energy"]} contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="kwh" name="kWh" fill="#b8860b" radius={[0, 3, 3, 0]} barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MachineTargetChart({
  data,
}: {
  data: { name: string; target: number; produced: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barGap={3} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
        <Bar dataKey="produced" name="Produced" fill="#b8860b" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
