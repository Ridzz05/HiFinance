"use client";
// app/page.tsx — Dashboard

import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import ThemeToggle from "@/components/ThemeToggle";
import { MonthlySummary, Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void } };
  }
}

function SkeletonBox({ h }: { h: number }) {
  return <div className="skeleton" style={{ height: h, borderRadius: 16 }} />;
}

export default function DashboardPage() {
  const [summary, setSummary]     = useState<MonthlySummary | null>(null);
  const [transactions, setTx]     = useState<Transaction[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.(); tg?.expand?.();
    const initData = tg?.initData;
    if (!initData) { setError("Buka melalui bot Telegram."); setLoading(false); return; }

    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/summary",      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData }) }),
          fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData, limit: 5 }) }),
        ]);
        if (!sRes.ok) throw new Error();
        const [s, t] = await Promise.all([sRes.json(), tRes.json()]);
        setSummary(s); setTx(t);
      } catch { setError("Gagal memuat data."); }
      finally { setLoading(false); }
    })();
  }, []);

  /* ── Error state ── */
  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 24 }}>
      <p style={{ fontSize: 32, color: "var(--text-3)" }}>—</p>
      <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--text-2)", textTransform: "uppercase" }}>{error}</p>
    </div>
  );

  return (
    <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header ── */}
      <div className="fade-0" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 4 }}>
            HiFinance
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1 }}>
            Overview
          </h1>
        </div>
        <ThemeToggle />
      </div>

      {/* ── Balance Card ── */}
      <div className="fade-1">
        {loading ? <SkeletonBox h={176} /> : summary && <BalanceCard summary={summary} />}
      </div>

      {/* ── Category Chart ── */}
      <div className="fade-2">
        <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 12 }}>
          Pengeluaran
        </p>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "16px 16px 12px" }}>
          {loading ? <SkeletonBox h={180} /> : summary && <CategoryChart data={summary.expense_by_category} />}
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="fade-3">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-2)", textTransform: "uppercase" }}>
            Terbaru
          </p>
          <a href="/transactions" style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--text-2)", textTransform: "uppercase", textDecoration: "none" }}>
            Semua →
          </a>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "0 16px" }}>
          {loading
            ? <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                {[0,1,2].map(i => <SkeletonBox key={i} h={48} />)}
              </div>
            : <TransactionList transactions={transactions} />
          }
        </div>
      </div>

    </div>
  );
}
