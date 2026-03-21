"use client";
// app/page.tsx — Dashboard utama TMA
// Membaca initData dari Telegram, fetch summary, lalu render kartu + chart

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

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tunggu Telegram SDK siap
    const tg = window.Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();

    const initData = tg?.initData;

    if (!initData) {
      // Mode development: tampilkan pesan tanpa crash
      setError("Buka melalui bot Telegram untuk melihat data.");
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

        if (!summaryRes.ok) throw new Error("Gagal mengambil ringkasan");
        const [summaryData, txData] = await Promise.all([
          summaryRes.json(),
          txRes.json(),
        ]);

        setSummary(summaryData);
        setTransactions(txData);
      } catch (err) {
        setError("Gagal memuat data. Coba lagi.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <span className="text-5xl mb-4">⚠️</span>
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-2 pb-1">
        <h1 className="text-xl font-bold text-slate-800">HiFinance 💰</h1>
        <p className="text-slate-400 text-sm">Pantau keuangan harianmu</p>
      </div>

      {/* Balance Card */}
      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : summary ? (
        <BalanceCard summary={summary} />
      ) : null}

      {/* Category Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold text-slate-700 mb-3">Pengeluaran per Kategori</h2>
        {loading ? (
          <Skeleton className="h-48 w-full" />
        ) : summary ? (
          <CategoryChart data={summary.expense_by_category} />
        ) : null}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700">Transaksi Terbaru</h2>
          <a href="/transactions" className="text-indigo-500 text-xs font-medium">
            Lihat semua →
          </a>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
