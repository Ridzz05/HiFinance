"use client";
// components/BalanceCard.tsx

import { MonthlySummary } from "@/lib/types";
import { calculateHealthScore, getHealthColorVar, getHealthColor } from "@/lib/health-logic";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
};

export default function BalanceCard({ summary }: { summary: MonthlySummary }) {
  const healthScore = calculateHealthScore(summary.total_expense, summary.budget_limit);
  const healthColorVar = getHealthColorVar(healthScore);
  const isHealthy = getHealthColor(healthScore) === "safe";

  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${isHealthy ? "var(--border-hi)" : "var(--expense-dim)"}`,
      borderRadius: 20,
      padding: "24px 20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Dynamic Health Glow */}
      <div style={{
        position: "absolute",
        top: -40, right: -40,
        width: 120, height: 120,
        background: isHealthy ? "var(--income-dim)" : "var(--expense-dim)",
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Period & Health Score Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase" }}>
          {summary.period.label} · {summary.transaction_count} transaksi
        </p>
        <div style={{ 
          background: isHealthy ? "var(--income-dim)" : "var(--expense-dim)", 
          color: healthColorVar,
          padding: "4px 8px", 
          borderRadius: 8, 
          fontSize: 9, 
          fontWeight: 700, 
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }}>
          Score: {healthScore}/100
        </div>
      </div>

      {/* Balance */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>
          Saldo
        </p>
        <p style={{
          fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1,
          marginBottom: 22,
          color: healthColorVar,
        }}>
          {fmt(summary.balance)}
        </p>
      </div>

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
