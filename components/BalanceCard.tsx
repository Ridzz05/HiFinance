"use client";
// components/BalanceCard.tsx

import { MonthlySummary } from "@/lib/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
};

export default function BalanceCard({ summary }: { summary: MonthlySummary }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-hi)",
        borderRadius: 20,
        padding: "24px 20px",
      }}
    >
      {/* Period */}
      <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 16 }}>
        {summary.period.label}
      </p>

      {/* Big balance */}
      <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>
        Saldo
      </p>
      <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 24, lineHeight: 1 }}>
        {fmt(summary.balance)}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

      {/* Income / Expense — two equal columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Income */}
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>
            Pemasukan
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--income)", letterSpacing: "-0.01em" }}>
            +{fmtShort(summary.total_income)}
          </p>
        </div>
        {/* Expense */}
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>
            Pengeluaran
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--expense)", letterSpacing: "-0.01em" }}>
            -{fmtShort(summary.total_expense)}
          </p>
        </div>
      </div>
    </div>
  );
}
