"use client";
// components/CategoryChart.tsx
// Donut chart pengeluaran per kategori menggunakan Recharts

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CategorySummary } from "@/lib/types";

const COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd",
  "#818cf8", "#4f46e5", "#7c3aed", "#5b21b6",
];

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  return `Rp ${amount}`;
}

interface CategoryChartProps {
  data: CategorySummary[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-slate-400">
        <span className="text-3xl mb-2">📭</span>
        <p className="text-sm">Belum ada pengeluaran bulan ini</p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="amount"
            nameKey="category"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatRupiah(value), "Jumlah"]}
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend custom */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item, i) => (
          <div key={item.category} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <div className="min-w-0">
              <p className="text-xs text-slate-600 truncate">{item.category}</p>
              <p className="text-xs font-semibold text-slate-800">
                {item.percentage}% · {formatRupiah(item.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
