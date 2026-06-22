"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#0f172a",
  boxShadow: "0 4px 16px -4px rgba(15,23,42,0.12)",
};

const FUNNEL_COLORS = ["#b8860b", "#c2a23a", "#a8924a", "#6b7280"];

export function CallsVsConnectedBar({
  data,
}: {
  data: { day: string; calls: number; connected: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" vertical={false} />
        <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(184,134,11,0.06)" }} />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b" }} iconSize={8} />
        <Bar dataKey="calls" name="Calls" fill="#64748b" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="connected" name="Connected" fill="#b8860b" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConversionFunnelChart({
  data,
}: {
  data: { stage: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <FunnelChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList dataKey="stage" position="right" fill="#0f172a" stroke="none" fontSize={12} />
          {data.map((entry, index) => (
            <Cell key={entry.stage} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}

export function WeeklyActivityLine({
  data,
}: {
  data: { week: string; activities: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" vertical={false} />
        <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="activities"
          name="Activities"
          stroke="#b8860b"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#b8860b" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
