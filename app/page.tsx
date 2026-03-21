"use client";
// app/page.tsx

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

function Skeleton() {
  return <div className="animate-pulse bg-white/4 rounded-xl h-full w-full" />;
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
        const [summaryData, txData] = await Promise.all([
          summaryRes.json(),
          txRes.json(),
        ]);
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
        <div className="w-px h-12 bg-white/10" />
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">{error}</p>
        <div className="w-px h-12 bg-white/10" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-[0.35em] text-neutral-600 uppercase mb-1">
            Financial Tracker
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">HiFinance</h1>
        </div>
        <div className="text-[10px] tracking-widest text-neutral-700 uppercase">
          {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Balance Card */}
      {loading ? (
        <div className="h-44"><Skeleton /></div>
      ) : summary ? (
        <BalanceCard summary={summary} />
      ) : null}

      {/* Chart Section */}
      <div>
        <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase mb-4">
          Pengeluaran
        </p>
        <div className="border border-white/5 rounded-2xl p-4 bg-[#0a0a0a]">
          {loading ? (
            <div className="h-48"><Skeleton /></div>
          ) : summary ? (
            <CategoryChart data={summary.expense_by_category} />
          ) : null}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            Terbaru
          </p>
          <a
            href="/transactions"
            className="text-[9px] tracking-widest text-neutral-500 uppercase hover:text-white transition-colors"
          >
            Lihat semua →
          </a>
        </div>
        <div className="border border-white/5 rounded-2xl px-4 bg-[#0a0a0a]">
          {loading ? (
            <div className="h-40"><Skeleton /></div>
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
}
