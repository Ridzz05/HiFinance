"use client";
// app/page.tsx

import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import { useTheme } from "@/components/ThemeProvider";
import { MonthlySummary, Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void } };
  }
}

function Skeleton() {
  return <div className="animate-pulse rounded-xl h-full w-full" style={{ background: "var(--skeleton)" }} />;
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
      style={{ background: "var(--surface)", border: "1px solid var(--border-mid)" }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Sun icon — switch to light
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon icon — switch to dark
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
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

    async function fetchData() {
      try {
        const [summaryRes, txRes] = await Promise.all([
          fetch("/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
          }),
          fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData, limit: 5 }),
          }),
        ]);

        if (!summaryRes.ok) throw new Error("Gagal");
        const [summaryData, txData] = await Promise.all([summaryRes.json(), txRes.json()]);
        setSummary(summaryData);
        setTransactions(txData);
      } catch {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-px h-12" style={{ background: "var(--border-mid)" }} />
        <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-muted)" }}>{error}</p>
        <div className="w-px h-12" style={{ background: "var(--border-mid)" }} />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
            Financial Tracker
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>HiFinance</h1>
        </div>
        <ThemeToggle />
      </div>

      {/* Balance Card */}
      {loading ? <div className="h-44"><Skeleton /></div> : summary ? <BalanceCard summary={summary} /> : null}

      {/* Chart */}
      <div>
        <p className="text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: "var(--text-muted)" }}>
          Pengeluaran
        </p>
        <div className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {loading ? <div className="h-48"><Skeleton /></div> : summary ? <CategoryChart data={summary.expense_by_category} /> : null}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "var(--text-muted)" }}>Terbaru</p>
          <a href="/transactions" className="text-[9px] tracking-widest uppercase transition-colors"
            style={{ color: "var(--text-muted)" }}>
            Lihat semua →
          </a>
        </div>
        <div className="rounded-2xl px-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {loading ? <div className="h-40"><Skeleton /></div> : <TransactionList transactions={transactions} />}
        </div>
      </div>
    </div>
  );
}
