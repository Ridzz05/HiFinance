"use client";
// app/transactions/page.tsx

import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import ExportButton from "@/components/ExportButton";
import { Transaction } from "@/lib/types";

type Filter = "all" | "income" | "expense";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",     label: "Semua" },
  { key: "income",  label: "Masuk" },
  { key: "expense", label: "Keluar" },
];

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

  return (
    <div className="px-4 pt-6 pb-2">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 animate-fade-up">
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
            Riwayat
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Transaksi</h1>
        </div>
        {!loading && <ExportButton />}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 animate-fade-up-1">
        {FILTERS.map(f => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-widest uppercase transition-all active:scale-95"
              style={{
                background: isActive ? "var(--text)" : "var(--surface)",
                color: isActive ? "var(--bg)" : "var(--text-muted)",
                border: `1px solid ${isActive ? "transparent" : "var(--border)"}`,
              }}
            >
              {f.label}
              {f.key !== "all" && (
                <span className="ml-1 opacity-60">
                  ({transactions.filter(t => t.type === f.key).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="card p-4 animate-fade-up-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <TransactionList transactions={filtered} grouped />
        )}
      </div>

      {!loading && transactions.length > 0 && (
        <p className="text-center text-[10px] tracking-[0.25em] uppercase mt-5"
          style={{ color: "var(--text-muted)" }}>
          {filtered.length} transaksi
        </p>
      )}
    </div>
  );
}
