"use client";
// app/page.tsx — Dashboard

import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import ThemeToggle from "@/components/ThemeToggle";
import { MonthlySummary, Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void } };
  }
}

function SkeletonBox({ h }: { h: number }) {
  return <div className="skeleton" style={{ height: h, borderRadius: 16 }} />;
}

/* ── Tip chip ── */
function Tip({ text }: { text: string }) {
  return (
    <p style={{
      fontSize: 10,
      color: "var(--text-2)",
      letterSpacing: "0.01em",
      lineHeight: 1.5,
      padding: "8px 0 2px",
    }}>
      {text}
    </p>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [transactions, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.(); tg?.expand?.();
    const initData = tg?.initData;
    if (!initData) { setError("Buka aplikasi ini melalui bot Telegram."); setLoading(false); return; }

    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/summary",      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData }) }),
          fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData, limit: 5 }) }),
        ]);
        if (!sRes.ok) throw new Error();
        const [s, t] = await Promise.all([sRes.json(), tRes.json()]);
        setSummary(s); setTx(t);
      } catch { setError("Gagal memuat data. Coba lagi."); }
      finally { setLoading(false); }
    })();
  }, []);

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 32px", textAlign: "center" }}>
      <p style={{ fontSize: 40, color: "var(--text-3)", lineHeight: 1 }}>—</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Akses Terbatas</p>
      <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{error}</p>
    </div>
  );

  return (
    <div style={{ padding: "28px 16px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Header ── */}
      <div className="fade-0" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>
            HiFinance · Keuangan Pribadi
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>
            Overview
          </h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, paddingTop: 2 }}>
          <ThemeToggle />
          <p style={{ fontSize: 8, color: "var(--text-2)", letterSpacing: "0.1em" }}>Tema</p>
        </div>
      </div>

      {/* ── Balance Card ── */}
      <div className="fade-1">
        <Tip text="Ringkasan keuangan bulan ini: total pemasukan, pengeluaran, dan saldo berjalan." />
        <div style={{ marginTop: 8 }}>
          {loading ? <SkeletonBox h={172} /> : summary && <BalanceCard summary={summary} />}
        </div>
      </div>

      {/* ── Category Chart ── */}
      <div className="fade-2">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase" }}>
            Pengeluaran per Kategori
          </p>
          <p style={{ fontSize: 9, color: "var(--text-2)" }}>Bulan ini</p>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "20px 16px 16px" }}>
          {loading ? <SkeletonBox h={200} /> : summary && <CategoryChart data={summary.expense_by_category} />}
        </div>
        <Tip text="Ketuk potongan grafik untuk melihat nominal per kategori." />
      </div>

      {/* ── Recent Transactions ── */}
      <div className="fade-3">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase" }}>
            Transaksi Terbaru
          </p>
          <a href="/transactions" style={{ fontSize: 10, fontWeight: 600, color: "var(--text)", textDecoration: "none", letterSpacing: "0.05em" }}>
            Lihat semua →
          </a>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "0 16px" }}>
          {loading
            ? <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                {[0,1,2].map(i => <SkeletonBox key={i} h={52} />)}
              </div>
            : <TransactionList transactions={transactions} />
          }
        </div>
        {!loading && transactions.length === 0 && (
          <Tip text="Belum ada transaksi bulan ini. Transaksi baru bisa ditambahkan melalui bot Telegram." />
        )}
      </div>

    </div>
  );
}
