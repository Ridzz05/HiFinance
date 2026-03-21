"use client";
// components/BalanceCard.tsx

import { MonthlySummary } from "@/lib/types";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BalanceCard({ summary }: { summary: MonthlySummary }) {
  const isPositive = summary.balance >= 0;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-mid)" }} className="rounded-2xl p-6">
      {/* Period */}
      <p style={{ color: "var(--text-muted)" }} className="text-[10px] font-medium tracking-[0.2em] uppercase mb-6">
        {summary.period.label} · {summary.transaction_count} transaksi
      </p>

      {/* Balance */}
      <div className="mb-8">
        <p style={{ color: "var(--text-muted)" }} className="text-[11px] tracking-widest uppercase mb-2">Saldo</p>
        <p
          className="text-5xl font-bold tracking-tight leading-none"
          style={{ color: isPositive ? "var(--income)" : "var(--expense)" }}
        >
          {isPositive ? "" : "−"}{formatRupiah(Math.abs(summary.balance))}
        </p>
      </div>

      {/* Divider */}
      <div style={{ background: "var(--border)" }} className="h-px mb-6" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-0">
        <div className="pr-4" style={{ borderRight: "1px solid var(--border)" }}>
          <p style={{ color: "var(--text-muted)" }} className="text-[10px] tracking-widest uppercase mb-1.5">Masuk</p>
          <p style={{ color: "var(--income)" }} className="text-base font-semibold">
            +{formatRupiah(summary.total_income)}
          </p>
        </div>
        <div className="pl-4">
          <p style={{ color: "var(--text-muted)" }} className="text-[10px] tracking-widest uppercase mb-1.5">Keluar</p>
          <p style={{ color: "var(--expense)" }} className="text-base font-semibold">
            −{formatRupiah(summary.total_expense)}
          </p>
        </div>
      </div>
    </div>
  );
}
