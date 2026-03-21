"use client";
// components/TransactionList.tsx

import { Transaction } from "@/lib/types";

const ICONS: Record<string, string> = {
  Makanan: "🍜", Minuman: "☕", Transport: "🚗", Belanja: "🛍️",
  Kesehatan: "💊", Hiburan: "🎬", Pendidikan: "📚", Tagihan: "⚡",
  Gaji: "💼", Investasi: "📈", Lainnya: "📦",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return n.toString();
}

function groupByDate(txs: Transaction[]): { label: string; items: Transaction[] }[] {
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const d = new Date(tx.created_at); d.setHours(0,0,0,0);
    let label: string;
    if (d.getTime() === today.getTime()) label = "Hari Ini";
    else if (d.getTime() === yesterday.getTime()) label = "Kemarin";
    else label = d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(tx);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

function TxItem({ tx }: { tx: Transaction }) {
  const isExpense = tx.type === "expense";
  const icon = ICONS[tx.category] ?? "💰";
  const time = new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: "var(--border)" }}>
      {/* Icon */}
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0"
        style={{ background: isExpense ? "rgba(244,63,94,0.1)" : "rgba(34,197,94,0.1)" }}>
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
          {tx.category}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
          {tx.note || "—"} · {time}
        </p>
      </div>

      {/* Amount */}
      <p className={`text-sm font-bold shrink-0 ${isExpense ? "text-rose-500" : "text-emerald-500"}`}>
        {isExpense ? "-" : "+"}Rp {fmt(tx.amount)}
      </p>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  grouped?: boolean;
}

export default function TransactionList({ transactions, grouped = false }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center py-10" style={{ color: "var(--text-muted)" }}>
        <span className="text-5xl mb-3">🌱</span>
        <p className="text-sm font-semibold">Belum ada transaksi</p>
        <p className="text-xs mt-1 opacity-60">Catat lewat bot Telegram!</p>
      </div>
    );
  }

  if (!grouped) {
    return <>{transactions.map(tx => <TxItem key={tx.id} tx={tx} />)}</>;
  }

  const groups = groupByDate(transactions);
  return (
    <>
      {groups.map(g => (
        <div key={g.label}>
          <p className="text-xs font-bold uppercase tracking-wide py-2 sticky top-0"
            style={{ color: "var(--text-muted)", background: "var(--surface)" }}>
            {g.label}
          </p>
          {g.items.map(tx => <TxItem key={tx.id} tx={tx} />)}
        </div>
      ))}
    </>
  );
}
