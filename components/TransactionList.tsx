"use client";
// components/TransactionList.tsx

import { Transaction } from "@/lib/types";

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

  return (
    <div className="flex items-center gap-4 py-3.5 last:border-0"
      style={{ borderBottom: "1px solid var(--border)" }}>
      {/* Initial avatar */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-wider shrink-0"
        style={{
          background: "var(--avatar-bg)",
          color: "var(--avatar-text)",
          border: "1px solid var(--avatar-border)",
        }}
      >
        {tx.category.slice(0, 2).toUpperCase()}
      </div>

      {/* Detail */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold tracking-widest uppercase truncate"
          style={{ color: "var(--text)" }}>
          {tx.category}
        </p>
        {tx.note && (
          <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
            {tx.note}
          </p>
        )}
        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-dim, #333)" }}>
          {formatDate(tx.created_at)}
        </p>
      </div>

      {/* Amount */}
      <p className="text-sm font-bold shrink-0 tabular-nums"
        style={{ color: isExpense ? "var(--expense)" : "var(--income)" }}>
        {isExpense ? "−" : "+"}{formatRupiah(tx.amount)}
      </p>
    </div>
  );
}

export default function TransactionList({
  transactions,
  limit,
}: {
  transactions: Transaction[];
  limit?: number;
}) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-12">
        <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-muted)" }}>
          Kosong
        </p>
      </div>
    );
  }

  return (
    <div>
      {items.map((tx) => <TransactionItem key={tx.id} tx={tx} />)}
    </div>
  );
}
