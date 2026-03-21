"use client";
// components/BalanceCard.tsx

import { MonthlySummary } from "@/lib/types";

function fmt(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return n.toLocaleString("id-ID");
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default function BalanceCard({ summary }: { summary: MonthlySummary }) {
  const positive = summary.balance >= 0;

  return (
    <div className="relative rounded-2xl overflow-hidden p-5 animate-fade-up"
      style={{
        background: "linear-gradient(135deg, #7c5cfc 0%, #5b21b6 60%, #4f1d98 100%)",
        boxShadow: "0 8px 32px rgba(124,92,252,0.35), 0 2px 8px rgba(0,0,0,0.2)",
      }}>

      {/* Subtle orb decoration */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
      <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #c4b5fd, transparent)" }} />

      {/* Period */}
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
        {summary.period.label}
      </p>

      {/* Balance */}
      <div className="mb-5">
        <p className="text-xs text-white/60 mb-0.5">Saldo Bulan Ini</p>
        <p className={`text-3xl font-extrabold tracking-tight ${positive ? "text-white" : "text-rose-300"}`}>
          {positive ? "" : "-"}{fmtFull(Math.abs(summary.balance))}
        </p>
        <p className={`text-xs font-medium mt-1 ${positive ? "text-emerald-300" : "text-rose-300"}`}>
          {positive ? "▲ Surplus" : "▼ Defisit"}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.10)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-emerald-300 text-base">↑</span>
            <span className="text-white/60 text-xs">Pendapatan</span>
          </div>
          <p className="text-white font-bold text-sm">Rp {fmt(summary.total_income)}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.10)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-rose-300 text-base">↓</span>
            <span className="text-white/60 text-xs">Pengeluaran</span>
          </div>
          <p className="text-white font-bold text-sm">Rp {fmt(summary.total_expense)}</p>
        </div>
      </div>

      {/* Transaction count */}
      <p className="text-white/30 text-xs mt-3 text-right">
        {summary.transaction_count} transaksi
      </p>
    </div>
  );
}
