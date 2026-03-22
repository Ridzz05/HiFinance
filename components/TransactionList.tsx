"use client";
// components/TransactionList.tsx

import { Transaction } from "@/lib/types";

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return `${n}`;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const day = new Date(iso); day.setHours(0,0,0,0);
  if (day.getTime() === today.getTime()) return "Hari ini";
  if (day.getTime() === yesterday.getTime()) return "Kemarin";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
}

function TxRow({ tx }: { tx: Transaction }) {
  const isExp = tx.type === "expense";
  const time = new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid var(--border)",
    }}>
      {/* Initials avatar — tinted by type */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isExp ? "var(--expense-dim)" : "var(--income-dim)",
        border: `1px solid ${isExp ? "var(--expense)" : "var(--income)"}`,
        fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
        color: isExp ? "var(--expense)" : "var(--income)",
        opacity: 0.9,
      }}>
        {tx.category.slice(0, 2).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {tx.category}
        </p>
        <p style={{ fontSize: 11, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {tx.note || "—"} · {time}
        </p>
      </div>

      {/* Amount */}
      <p style={{
        fontSize: 13, fontWeight: 700,
        color: isExp ? "var(--expense)" : "var(--income)",
        flexShrink: 0, fontVariantNumeric: "tabular-nums",
      }}>
        {isExp ? "−" : "+"}Rp {fmt(tx.amount)}
      </p>
    </div>
  );
}

function groupByDate(txs: Transaction[]) {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const label = formatDate(tx.created_at);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(tx);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

export default function TransactionList({ transactions, grouped = false }: {
  transactions: Transaction[];
  grouped?: boolean;
}) {
  if (!transactions.length) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <p style={{ fontSize: 24, color: "var(--text-3)", marginBottom: 8 }}>—</p>
        <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--text-2)", textTransform: "uppercase" }}>
          Belum ada transaksi
        </p>
      </div>
    );
  }

  if (!grouped) {
    return <div>{transactions.map(tx => <TxRow key={tx.id} tx={tx} />)}</div>;
  }

  const groups = groupByDate(transactions);
  return (
    <div>
      {groups.map(g => (
        <div key={g.label}>
          <p style={{
            fontSize: 9, letterSpacing: "0.2em", color: "var(--accent)",
            textTransform: "uppercase", padding: "10px 0 6px",
            fontWeight: 700, background: "var(--surface)", position: "sticky", top: 0,
          }}>
            {g.label}
          </p>
          {g.items.map(tx => <TxRow key={tx.id} tx={tx} />)}
        </div>
      ))}
    </div>
  );
}
