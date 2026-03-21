"use client";
// components/CategoryChart.tsx

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategorySummary } from "@/lib/types";

// Grayscale palette — darkest to lightest
const GRAYS = ["#ffffff", "#aaaaaa", "#777777", "#555555", "#333333", "#222222", "#1a1a1a", "#111111"];

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  return `Rp ${amount}`;
}

export default function CategoryChart({ data }: { data: CategorySummary[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-36">
        <p className="text-[10px] tracking-[0.3em] text-neutral-700 uppercase">Tidak ada data</p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={2}
            dataKey="amount"
            nameKey="category"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={GRAYS[index % GRAYS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [formatRupiah(Number(value)), ""]}
            contentStyle={{
              background: "#0f0f0f",
              border: "1px solid #222",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "11px",
              letterSpacing: "0.05em",
            }}
            itemStyle={{ color: "#aaa" }}
            labelStyle={{ color: "#fff", fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {data.map((item, i) => (
          <div key={item.category} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: GRAYS[i % GRAYS.length] }}
            />
            <div className="min-w-0">
              <p className="text-[10px] tracking-widest text-neutral-500 uppercase truncate">
                {item.category}
              </p>
              <p className="text-[11px] font-semibold text-neutral-300">
                {item.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
