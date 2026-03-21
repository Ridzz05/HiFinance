"use client";
// components/CategoryChart.tsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategorySummary } from "@/lib/types";

const PALETTE = ["#7c5cfc", "#f43f5e", "#22c55e", "#f59e0b", "#06b6d4", "#e879f9", "#fb923c", "#a78bfa"];

function fmt(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}

export default function CategoryChart({ data }: { data: CategorySummary[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-8" style={{ color: "var(--text-muted)" }}>
        <span className="text-4xl mb-2">🌿</span>
        <p className="text-sm font-medium">Belum ada pengeluaran</p>
        <p className="text-xs mt-1 opacity-60">Mulai catat transaksi di bot!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Donut */}
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={52} outerRadius={78}
            paddingAngle={3}
            dataKey="amount"
            startAngle={90} endAngle={-270}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [fmt(v), ""]}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              boxShadow: "var(--shadow-md)",
              color: "var(--text)",
              fontSize: 12,
            }}
            itemStyle={{ color: "var(--text)" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {data.map((item, i) => (
          <div key={item.category} className="flex items-center gap-2 py-1">
            <span className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>
                {item.category}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {item.percentage}% · {fmt(item.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
