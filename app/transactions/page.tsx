"use client";
// app/transactions/page.tsx — Halaman semua transaksi

import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } };
  }
}

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
    <div className="p-4">
      <div className="pt-2 pb-4">
        <h1 className="text-xl font-bold text-slate-800">Semua Transaksi 📋</h1>
        <p className="text-slate-400 text-sm">50 transaksi terbaru</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 rounded-xl h-12" />
            ))}
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
