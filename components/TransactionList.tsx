"use client";
// components/TransactionItem.tsx + TransactionList.tsx

import { Transaction } from "@/lib/types";

const CATEGORY_ICONS: Record<string, string> = {
  Makanan: "🍜", Minuman: "☕", Transport: "🚗", Belanja: "🛍️",
  Kesehatan: "💊", Hiburan: "🎬", Pendidikan: "📚", Tagihan: "⚡",
  Gaji: "💼", Investasi: "📈", Lainnya: "📦",
};

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  return `Rp ${amount}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function TransactionItem({ tx }: { tx: Transaction }) {
  const isExpense = tx.type === "expense";
  const icon = CATEGORY_ICONS[tx.category] ?? "💰";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      {/* Icon kategori */}
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </div>

      {/* Detail */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{tx.category}</p>
        {tx.note && (
          <p className="text-xs text-slate-400 truncate">{tx.note}</p>
        )}
        <p className="text-xs text-slate-400">{formatDate(tx.created_at)}</p>
      </div>

      {/* Nominal */}
      <p className={`text-sm font-bold flex-shrink-0 ${isExpense ? "text-rose-500" : "text-emerald-500"}`}>
        {isExpense ? "-" : "+"}{formatRupiah(tx.amount)}
      </p>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export default function TransactionList({ transactions, limit }: TransactionListProps) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-slate-400">
        <span className="text-4xl mb-2">📭</span>
        <p className="text-sm">Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((tx) => (
        <TransactionItem key={tx.id} tx={tx} />
      ))}
    </div>
  );
}
