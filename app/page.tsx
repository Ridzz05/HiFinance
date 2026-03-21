"use client";
// app/page.tsx — Dashboard utama

import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import ExportButton from "@/components/ExportButton";
import { MonthlySummary, Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void; colorScheme?: string } };
  }
}

function Skeleton({ h = "h-10", w = "w-full" }: { h?: string; w?: string }) {
  return <div className={`skeleton ${h} ${w} rounded-2xl`} />;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Sobat");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();

    const initData = tg?.initData;

    // Parse user name from initData
    try {
      const params = new URLSearchParams(initData ?? "");
      const user = JSON.parse(params.get("user") ?? "{}");
      if (user.first_name) setUserName(user.first_name);
    } catch {}

    if (!initData) {
      setError("Buka melalui bot Telegram untuk melihat data keuangan kamu.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData }) }),
          fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData, limit: 5 }) }),
        ]);
        if (!sRes.ok) throw new Error("Gagal mengambil data");
        const [s, t] = await Promise.all([sRes.json(), tRes.json()]);
        setSummary(s);
        setTransactions(t);
      } catch {
        setError("Gagal memuat data. Coba lagi.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-3">
        <span className="text-6xl">⚠️</span>
        <p className="font-semibold" style={{ color: "var(--text)" }}>Akses Dibatasi</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{greeting} 👋</p>
          <h1 className="text-lg font-extrabold" style={{ color: "var(--text)" }}>{userName}</h1>
        </div>
        {!loading && <ExportButton />}
      </div>

      {/* Balance Card */}
      <div className="animate-fade-up-1">
        {loading ? <Skeleton h="h-44" /> : summary && <BalanceCard summary={summary} />}
      </div>

      {/* Category Chart */}
      <div className="card p-4 animate-fade-up-2">
        <h2 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
          Pengeluaran per Kategori
        </h2>
        {loading ? <Skeleton h="h-48" /> : summary && <CategoryChart data={summary.expense_by_category} />}
      </div>

      {/* Recent Transactions */}
      <div className="card p-4 animate-fade-up-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Transaksi Terbaru
          </h2>
          <a href="/transactions" className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
            Semua →
          </a>
        </div>

        {loading ? (
          <div className="space-y-3 mt-3">
            {[1,2,3].map(i => <Skeleton key={i} h="h-12" />)}
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
