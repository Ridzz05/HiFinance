"use client";
// components/CategoryChart.tsx — Nihilism style

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategorySummary } from "@/lib/types";

// Monochromatic greys/whites — Nihilism palette
const PALETTE = [
  "rgba(255,255,255,0.90)",
  "rgba(255,255,255,0.55)",
  "rgba(255,255,255,0.35)",
  "rgba(255,255,255,0.20)",
  "rgba(255,255,255,0.12)",
  "rgba(255,255,255,0.70)",
  "rgba(255,255,255,0.45)",
  "rgba(255,255,255,0.25)",
];

// For light mode — inverted
const PALETTE_LIGHT = [
  "rgba(0,0,0,0.85)",
  "rgba(0,0,0,0.55)",
  "rgba(0,0,0,0.35)",
  "rgba(0,0,0,0.20)",
  "rgba(0,0,0,0.12)",
  "rgba(0,0,0,0.65)",
  "rgba(0,0,0,0.42)",
  "rgba(0,0,0,0.24)",
];

function fmt(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}

export default function CategoryChart({ data }: { data: CategorySummary[] }) {
  // Detect theme
  const isLight = typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "light";
  const palette = isLight ? PALETTE_LIGHT : PALETTE;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-2xl font-bold"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-dim)" }}
        >
          —
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Belum ada pengeluaran
        </p>
      </div>
    );
  }

  return (
    <div>
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
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [fmt(v), ""]}
            contentStyle={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--border-mid)",
              borderRadius: 10,
              color: "var(--text)",
              fontSize: 12,
              fontFamily: "Space Grotesk",
              padding: "8px 12px",
              boxShadow: "var(--shadow-md)",
            }}
            itemStyle={{ color: "var(--text)" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((item, i) => (
          <div key={item.category} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: palette[i % palette.length] }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>
                {item.category}
              </p>
              <p className="text-xs mono" style={{ color: "var(--text-muted)" }}>
                {item.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
