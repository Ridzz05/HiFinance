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
  const isPositive = summary.balance >= 0;

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border-hi)",
      borderRadius: 20,
      padding: "24px 20px",
    }}>
      {/* Period */}
      <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 18 }}>
        {summary.period.label} · {summary.transaction_count} transaksi
      </p>

      {/* Balance */}
      <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>
        Saldo
      </p>
      <p style={{
        fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1,
        marginBottom: 22,
        color: isPositive ? "var(--text)" : "var(--expense)",
      }}>
        {fmt(summary.balance)}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

      {/* Income / Expense — 2-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Income */}
        <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--income-dim)" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--income)", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
            Pemasukan
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--income)", letterSpacing: "-0.01em" }}>
            +{fmtShort(summary.total_income)}
          </p>
        </div>
        {/* Expense */}
        <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--expense-dim)" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--expense)", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>
            Pengeluaran
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--expense)", letterSpacing: "-0.01em" }}>
            -{fmtShort(summary.total_expense)}
          </p>
        </div>
      </div>
    </div>
  );
}
