"use client";
// app/transactions/page.tsx

import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import ExportButton from "@/components/ExportButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Transaction } from "@/lib/types";

type Filter = "all" | "income" | "expense";

export default function TransactionsPage() {
  const [transactions, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<Filter>("all");

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) { setLoading(false); return; }
    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData, limit: 50 }),
    })
      .then(r => r.json()).then(setTx)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);
  const counts = {
    all:     transactions.length,
    income:  transactions.filter(t => t.type === "income").length,
    expense: transactions.filter(t => t.type === "expense").length,
  };

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all",     label: "Semua" },
    { key: "income",  label: "Masuk" },
    { key: "expense", label: "Keluar" },
  ];

  return (
    <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Header ── */}
      <div className="fade-0" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 4 }}>
            Riwayat
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1 }}>
            Transaksi
          </h1>
        </div>
        {/* Toggle + Export aligned right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
          {!loading && <ExportButton />}
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="fade-1" style={{ display: "flex", gap: 8 }}>
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                flex: 1,
                padding: "10px 4px",
                borderRadius: 12,
                border: `1px solid ${active ? "transparent" : "var(--border-hi)"}`,
                background: active ? "var(--pill-active-bg)" : "var(--pill-bg)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                transition: "all 0.15s",
              }}
            >
              <span style={{
                fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                color: active ? "var(--pill-active-text)" : "var(--text)",
                lineHeight: 1,
              }}>
                {loading ? "—" : counts[key]}
              </span>
              <span style={{
                fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase",
                color: active ? "var(--pill-active-text)" : "var(--pill-text)",
                fontWeight: 600,
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── List ── */}
      <div className="fade-2" style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "0 16px" }}>
        {loading ? (
          <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 12 }} />
            ))}
          </div>
        ) : (
          <TransactionList transactions={filtered} grouped />
        )}
      </div>

      {/* ── Count footer ── */}
      {!loading && filtered.length > 0 && (
        <p className="fade-3" style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", paddingBottom: 4 }}>
          {filtered.length} transaksi
        </p>
      )}

    </div>
  );
}
