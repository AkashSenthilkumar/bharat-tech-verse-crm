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

const STATUS_COLORS: Record<string, string> = {
  New: "#3b82f6",
  Interested: "#a855f7",
  "Follow-up": "#eab308",
  "Site Visit": "#f97316",
  Won: "#34d399",
  Lost: "#f43f5e",
};

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#0f172a",
  boxShadow: "0 4px 16px -4px rgba(15,23,42,0.12)",
};

export function LeadStatusPie({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: "#64748b" }}
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyConversionsBar({
  data,
}: {
  data: { month: string; conversions: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(15,23,42,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(184,134,11,0.08)" }} />
        <Bar dataKey="conversions" fill="#b8860b" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FollowupPerformanceLine({
  data,
}: {
  data: { day: string; completed: number; missed: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(15,23,42,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b" }} iconSize={8} />
        <Line
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke="#b8860b"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#b8860b" }}
        />
        <Line
          type="monotone"
          dataKey="missed"
          name="Missed"
          stroke="#64748b"
          strokeWidth={2}
          dot={{ r: 3, fill: "#64748b" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
