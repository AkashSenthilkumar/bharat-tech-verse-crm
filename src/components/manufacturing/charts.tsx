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
