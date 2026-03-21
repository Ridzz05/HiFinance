"use client";
// components/TransactionList.tsx — Nihilism style

import { Transaction } from "@/lib/types";

// Short category labels (no emoji)
const CAT_SHORT: Record<string, string> = {
  Makanan: "MKN", Minuman: "MNM", Transport: "TRP", Belanja: "BLJ",
  Kesehatan: "KSH", Hiburan: "HIB", Pendidikan: "PDK", Tagihan: "TGH",
  Gaji: "GAJ", Investasi: "INV", Lainnya: "LNY",
};

function fmtShort(n: number) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n/1_000).toFixed(0)}rb`;
  return n.toLocaleString("id-ID");
}

function groupByDate(txs: Transaction[]): { label: string; items: Transaction[] }[] {
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const d = new Date(tx.created_at); d.setHours(0,0,0,0);
    let label: string;
    if (d.getTime() === today.getTime()) label = "Today";
    else if (d.getTime() === yesterday.getTime()) label = "Yesterday";
    else label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(tx);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

function TxItem({ tx }: { tx: Transaction }) {
  const isExpense = tx.type === "expense";
  const tag = CAT_SHORT[tx.category] ?? tx.category.slice(0, 3).toUpperCase();
  const time = new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Category tag */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mono"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: "var(--text-muted)",
        }}
      >
        {tag}
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
      <p
        className="text-sm font-bold shrink-0 mono"
        style={{ color: isExpense ? "var(--expense)" : "var(--income)" }}
      >
        {isExpense ? "–" : "+"}Rp {fmtShort(tx.amount)}
      </p>
    </div>
  );
}

export default function TransactionList({
  transactions,
  grouped = false,
}: {
  transactions: Transaction[];
  grouped?: boolean;
}) {
  if (transactions.length === 0) {
    return (
      <div className="py-10 flex flex-col items-center gap-2">
        <p className="text-2xl font-bold" style={{ color: "var(--text-dim)" }}>—</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Belum ada transaksi</p>
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
          <p
            className="text-xs font-bold py-2 sticky top-0 uppercase tracking-widest"
            style={{
              color: "var(--text-muted)",
              background: "var(--surface)",
              letterSpacing: "0.08em",
              fontSize: "0.6rem",
            }}
          >
            {g.label}
          </p>
          {g.items.map(tx => <TxItem key={tx.id} tx={tx} />)}
        </div>
      ))}
    </>
  );
}
