"use client";
// app/page.tsx — Dashboard

import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import { MonthlySummary, Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void } };
  }
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();
    const initData = tg?.initData;

    if (!initData) {
      setError("Buka melalui bot Telegram.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData }) }),
          fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData, limit: 5 }) }),
        ]);
        if (!sRes.ok) throw new Error();
        const [s, t] = await Promise.all([sRes.json(), tRes.json()]);
        setSummary(s);
        setTransactions(t);
      } catch {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <p className="text-3xl font-bold" style={{ color: "var(--text-dim)" }}>—</p>
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">

      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
          Financial Tracker
        </p>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
          HiFinance
        </h1>
      </div>

      {/* Balance Card */}
      <div className="animate-fade-up-1">
        {loading
          ? <div className="skeleton rounded-2xl h-44" />
          : summary && <BalanceCard summary={summary} />
        }
      </div>

      {/* Chart */}
      <div className="animate-fade-up-2">
        <p className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>
          Pengeluaran per Kategori
        </p>
        <div className="card p-4">
          {loading
            ? <div className="skeleton rounded-xl h-48" />
            : summary && <CategoryChart data={summary.expense_by_category} />
          }
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="animate-fade-up-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "var(--text-muted)" }}>
            Terbaru
          </p>
          <a
            href="/transactions"
            className="text-[9px] tracking-widest uppercase transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            Lihat semua →
          </a>
        </div>
        <div className="card p-4">
          {loading
            ? <div className="space-y-3">{[0,1,2].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
            : <TransactionList transactions={transactions} />
          }
        </div>
      </div>

    </div>
  );
}
