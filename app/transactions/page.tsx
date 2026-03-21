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
        <p className="text-[9px] tracking-[0.35em] text-neutral-600 uppercase mb-1">
          Riwayat
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-white">Transaksi</h1>
      </div>

      {/* List */}
      <div className="border border-white/5 rounded-2xl px-4 bg-[#0a0a0a]">
        {loading ? (
          <div className="space-y-0 py-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse bg-white/3 rounded-lg my-1"
              />
            ))}
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>

      {/* Count */}
      {!loading && transactions.length > 0 && (
        <p className="text-center text-[10px] tracking-[0.25em] text-neutral-700 uppercase mt-6">
          {transactions.length} transaksi
        </p>
      )}
    </div>
  );
}
