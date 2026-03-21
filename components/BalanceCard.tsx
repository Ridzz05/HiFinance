"use client";
// components/BalanceCard.tsx — Nihilism style

import { MonthlySummary } from "@/lib/types";

function fmtFull(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(n);
}

function fmtShort(n: number) {
  const a = Math.abs(n);
  if (a >= 1_000_000_000) return `${(n/1_000_000_000).toFixed(2)}B`;
  if (a >= 1_000_000) return `${(n/1_000_000).toFixed(2)}jt`;
  if (a >= 1_000) return `${(n/1_000).toFixed(0)}rb`;
  return n.toLocaleString("id-ID");
}

export default function BalanceCard({ summary }: { summary: MonthlySummary }) {
  const positive = summary.balance >= 0;

  return (
    <div
      className="rounded-2xl p-5 animate-fade-up"
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--border-mid)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {summary.period.label}
        </span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full mono"
          style={{
            background: positive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
            color: positive ? "var(--text)" : "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          {positive ? "+" : "–"}{fmtShort(Math.abs(summary.balance))}
        </span>
      </div>

      {/* Main balance */}
      <div className="mb-6">
        <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Saldo</p>
        <p
          className="text-4xl font-bold mono leading-none tracking-tight"
          style={{ color: positive ? "var(--text)" : "var(--text-muted)" }}
        >
          {fmtFull(summary.balance)}
        </p>
      </div>

      {/* Divider */}
      <div className="mb-4" style={{ height: "1px", background: "var(--border)" }} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Pendapatan</p>
          <p className="text-base font-semibold mono" style={{ color: "var(--income)" }}>
            +{fmtShort(summary.total_income)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Pengeluaran</p>
          <p className="text-base font-semibold mono" style={{ color: "var(--expense)" }}>
            –{fmtShort(summary.total_expense)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs mt-4" style={{ color: "var(--text-dim)" }}>
        {summary.transaction_count} transaksi
      </p>
    </div>
  );
}
