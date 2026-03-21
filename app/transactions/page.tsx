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
      .then(r => r.json())
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? transactions
    : transactions.filter(t => t.type === filter);

  const counts = {
    income:  transactions.filter(t => t.type === "income").length,
    expense: transactions.filter(t => t.type === "expense").length,
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">

      {/* Header */}
      <div className="flex items-end justify-between animate-fade-up">
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
            Riwayat
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Transaksi
          </h1>
        </div>
        {!loading && <ExportButton />}
      </div>

      {/* Filter Tabs — full width grid */}
      <div className="grid grid-cols-3 gap-2 animate-fade-up-1">
        {FILTERS.map(f => {
          const isActive = filter === f.key;
          const count = f.key === "all" ? transactions.length : counts[f.key as "income" | "expense"];
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex flex-col items-center py-2.5 rounded-xl transition-all active:scale-95"
              style={{
                background: isActive ? "var(--text)" : "var(--surface)",
                border: `1px solid ${isActive ? "transparent" : "var(--border)"}`,
              }}
            >
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: isActive ? "var(--bg)" : "var(--text)" }}
              >
                {loading ? "—" : count}
              </span>
              <span
                className="text-[9px] tracking-widest uppercase mt-0.5"
                style={{ color: isActive ? "var(--bg)" : "var(--text-muted)" }}
              >
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Transaction List */}
      <div className="card p-4 animate-fade-up-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <TransactionList transactions={filtered} grouped />
        )}
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p
          className="text-center text-[10px] tracking-[0.25em] uppercase pb-2"
          style={{ color: "var(--text-muted)" }}
        >
          {filtered.length} transaksi
        </p>
      )}

    </div>
  );
}
