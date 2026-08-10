"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface WeightPoint {
  label: string;
  weight: number;
}

export function WeightChart({ data }: { data: WeightPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        No weight data yet — it&apos;ll appear here once you log check-ins.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              background: "var(--background)",
              border: "1px solid rgba(128,128,128,0.3)",
              borderRadius: 8,
            }}
            formatter={(value) => [`${value} kg`, "Weight"]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3ddcff"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
