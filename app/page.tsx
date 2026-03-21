"use client";
// app/page.tsx — Nihilism Dashboard

import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import ExportButton from "@/components/ExportButton";
import ThemeToggle from "@/components/ThemeToggle";
import { MonthlySummary, Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void } };
  }
}

function Skeleton({ cls = "" }: { cls?: string }) {
  return <div className={`skeleton ${cls}`} />;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("—");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();
    const initData = tg?.initData;

    try {
      const p = new URLSearchParams(initData ?? "");
      const u = JSON.parse(p.get("user") ?? "{}");
      if (u.first_name) setUserName(u.first_name);
    } catch {}

    if (!initData) {
      setError("Buka melalui bot Telegram.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/summary", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
          }),
          fetch("/api/transactions", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData, limit: 5 }),
          }),
        ]);
        if (!sRes.ok) throw new Error();
        const [s, t] = await Promise.all([sRes.json(), tRes.json()]);
        setSummary(s); setTransactions(t);
      } catch {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-2xl font-bold mono" style={{ color: "var(--text-dim)" }}>—</p>
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Akses Terbatas</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-3 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between animate-fade-up">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
            HiFinance
          </p>
          <h1 className="text-xl font-bold mt-0.5" style={{ color: "var(--text)" }}>
            {userName}
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <ThemeToggle />
          {!loading && <ExportButton />}
        </div>
      </div>

      {/* Balance Card */}
      <div className="animate-fade-up-1">
        {loading ? <Skeleton cls="h-44 rounded-2xl" /> : summary && <BalanceCard summary={summary} />}
      </div>

      {/* Category Chart */}
      <div className="card p-4 animate-fade-up-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
          Pengeluaran per Kategori
        </p>
        {loading ? <Skeleton cls="h-48 rounded-xl" /> : summary && <CategoryChart data={summary.expense_by_category} />}
      </div>

      {/* Recent Transactions */}
      <div className="card p-4 animate-fade-up-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}>
            Transaksi Terbaru
          </p>
          <a href="/transactions" className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Semua →
          </a>
        </div>
        {loading ? (
          <div className="space-y-3 mt-3">
            {[0,1,2].map(i => <Skeleton key={i} cls="h-12 rounded-xl" />)}
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
