"use client";
// app/transactions/page.tsx

import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import ExportButton from "@/components/ExportButton";
import { Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } };
  }
}

type Filter = "all" | "income" | "expense";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) { setLoading(false); return; }
    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, limit: 50 }),
    })
      .then(r => r.json()).then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "income", label: "Pendapatan" },
    { key: "expense", label: "Pengeluaran" },
  ];

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-fade-up">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: "var(--text)" }}>Transaksi</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>50 transaksi terbaru</p>
        </div>
        {!loading && <ExportButton />}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 animate-fade-up-1">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
            style={{
              background: filter === f.key ? "var(--brand)" : "var(--surface)",
              color: filter === f.key ? "#fff" : "var(--text-muted)",
              border: `1px solid ${filter === f.key ? "transparent" : "var(--border)"}`,
              boxShadow: filter === f.key ? "0 2px 8px rgba(124,92,252,0.3)" : "var(--shadow-sm)",
            }}
          >
            {f.label}
            {f.key !== "all" && (
              <span className="ml-1 opacity-70">
                ({transactions.filter(t => t.type === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card p-4 animate-fade-up-2">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <TransactionList transactions={filtered} grouped />
        )}
      </div>
    </div>
  );
}
