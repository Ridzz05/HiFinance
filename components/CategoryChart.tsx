"use client";
// components/CategoryChart.tsx — Financial Color Palette

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategorySummary } from "@/lib/types";

// Financial palette: blues, teals, golds, slate tones
const PALETTE = [
  "#2563eb",  // Blue — primary
  "#059669",  // Emerald — growth
  "#d97706",  // Amber — gold
  "#7c3aed",  // Violet — alternate
  "#0891b2",  // Cyan — market
  "#dc2626",  // Red — loss/risk
  "#0d9488",  // Teal — savings
  "#64748b",  // Slate — neutral
];

function fmt(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}

export default function CategoryChart({ data }: { data: CategorySummary[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-8" style={{ color: "var(--text-muted)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
          style={{ background: "var(--brand-light)" }}>
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Belum ada pengeluaran</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Catat transaksi di bot Telegram</p>
      </div>
    );
  }

  return (
    <div>
      {/* Donut chart */}
      <ResponsiveContainer width="100%" height={185}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={54} outerRadius={80}
            paddingAngle={2}
            dataKey="amount"
            startAngle={90} endAngle={-270}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
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
              fontWeight: 500,
              padding: "8px 12px",
            }}
            labelStyle={{ color: "var(--text-muted)", fontWeight: 600 }}
            itemStyle={{ color: "var(--text)" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend — 2 col grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {data.map((item, i) => (
          <div key={item.category} className="flex items-center gap-2">
            <span className="w-2 h-7 rounded-full shrink-0"
              style={{ background: PALETTE[i % PALETTE.length] }} />
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>
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
