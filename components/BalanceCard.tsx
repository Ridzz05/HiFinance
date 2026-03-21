"use client";
// components/BalanceCard.tsx — Financial Navy Theme

import { MonthlySummary } from "@/lib/types";

function fmtShort(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}M`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return n.toLocaleString("id-ID");
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(n);
}

export default function BalanceCard({ summary }: { summary: MonthlySummary }) {
  const positive = summary.balance >= 0;

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5 animate-fade-up"
      style={{
        /* Deep navy → electric blue — "Bloomberg terminal" gradient */
        background: "linear-gradient(135deg, #0f2952 0%, #1b4f9b 55%, #2563eb 100%)",
        boxShadow: "0 8px 32px rgba(15,41,82,0.45), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Subtle grid lines — Bloomberg aesthetic */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(255,255,255,0.6) 24px,rgba(255,255,255,0.6) 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,rgba(255,255,255,0.6) 24px,rgba(255,255,255,0.6) 25px)",
        }} />

      {/* Light sweep glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)", transform: "translate(25%, -25%)" }} />

      {/* Period + badge */}
      <div className="flex items-center justify-between mb-4 relative">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
          {summary.period.label}
        </p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${positive ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300"}`}>
          {positive ? "▲ Surplus" : "▼ Defisit"}
        </span>
      </div>

      {/* Balance */}
      <div className="mb-5 relative">
        <p className="text-xs font-medium text-white/50 mb-0.5">Total Saldo</p>
        <p className={`text-[2rem] font-extrabold tracking-tight leading-none ${positive ? "text-white" : "text-rose-300"}`}>
          {positive ? "" : "−"}{fmtFull(Math.abs(summary.balance))}
        </p>
      </div>

      {/* Income / Expense grid */}
      <div className="grid grid-cols-2 gap-2.5 relative">
        {/* Income */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center text-[9px] text-white font-bold">↑</div>
            <span className="text-white/50 text-xs">Masuk</span>
          </div>
          <p className="text-white font-bold text-sm">Rp {fmtShort(summary.total_income)}</p>
        </div>
        {/* Expense */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-rose-400 flex items-center justify-center text-[9px] text-white font-bold">↓</div>
            <span className="text-white/50 text-xs">Keluar</span>
          </div>
          <p className="text-white font-bold text-sm">Rp {fmtShort(summary.total_expense)}</p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-white/20 text-xs mt-3 text-right relative">
        {summary.transaction_count} transaksi tercatat
      </p>
    </div>
  );
}
