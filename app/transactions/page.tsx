"use client";
// app/transactions/page.tsx

import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) { setLoading(false); return; }

    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, limit: 50 }),
    })
      .then((r) => r.json())
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
          Riwayat
        </p>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Transaksi</h1>
      </div>

      {/* List */}
      <div className="rounded-2xl px-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {loading ? (
          <div className="py-2 space-y-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: "var(--skeleton)" }} />
            ))}
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>

      {!loading && transactions.length > 0 && (
        <p className="text-center text-[10px] tracking-[0.25em] uppercase mt-6"
          style={{ color: "var(--text-muted)" }}>
          {transactions.length} transaksi
        </p>
      )}
    </div>
  );
}
