"use client";
// components/CategoryChart.tsx

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategorySummary } from "@/lib/types";

const DARK  = ["#ffffff", "#aaaaaa", "#666666", "#444444", "#222222", "#181818"];
const LIGHT = ["#000000", "#555555", "#888888", "#aaaaaa", "#cccccc", "#e0e0e0"];

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
};

function getColors() {
  if (typeof document === "undefined") return DARK;
  return document.documentElement.getAttribute("data-theme") === "light" ? LIGHT : DARK;
}

export default function CategoryChart({ data }: { data: CategorySummary[] }) {
  const colors = getColors();

  if (!data.length) {
    return (
      <div style={{ padding: "32px 0", textAlign: "center" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase" }}>
          Tidak ada data
        </p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={46} outerRadius={72}
            paddingAngle={2} dataKey="amount" strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip
            formatter={(v) => [fmtShort(Number(v)), ""]}
            contentStyle={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--border-hi)",
              borderRadius: 10,
              fontSize: 11,
              color: "var(--text)",
            }}
            itemStyle={{ color: "var(--text-2)" }}
            labelStyle={{ color: "var(--text)", fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginTop: 12 }}>
        {data.map((item, i) => (
          <div key={item.category} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length], flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-2)", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.category}
              </p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text)" }}>{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
