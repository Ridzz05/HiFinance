"use client";

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

/* ─── Skeleton atoms ─── */
function S({ w = "100%", h = 14, r = 8 }: { w?: string | number; h?: number; r?: number }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }} />;
}

function DashboardSkeleton() {
  return (
    <div style={{ padding: "28px 16px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <S w={90} h={10} />
          <S w={130} h={26} r={6} />
        </div>
        <S w={36} h={20} r={10} />
      </div>

      {/* Balance Card */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <S w={80} h={10} />
        <S w="70%" h={38} r={6} />
        <div style={{ height: 1, background: "var(--border)" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><S w={60} h={10} /><S w="80%" h={18} r={6} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><S w={60} h={10} /><S w="80%" h={18} r={6} /></div>
        </div>
      </div>

      {/* Chart section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <S w={130} h={10} />
          <S w={60} h={10} />
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "20px 16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div className="skeleton" style={{ width: 144, height: 144, borderRadius: "50%" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <S w={8} h={8} r={2} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <S w="60%" h={9} />
                  <S w="40%" h={11} r={4} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <S w={110} h={10} />
          <S w={70} h={10} />
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "12px 16px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
              <S w={38} h={38} r={10} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <S w="50%" h={13} r={4} />
                <S w="70%" h={11} r={4} />
              </div>
              <S w={60} h={13} r={4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Tip text ─── */
function Tip({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 10, color: "var(--text-2)", lineHeight: 1.5, padding: "6px 0 2px" }}>
      {text}
    </p>
  );
}

interface DashboardUIProps {
  mockData?: {
    summary: MonthlySummary;
    transactions: Transaction[];
  };
}

export default function DashboardUI({ mockData }: DashboardUIProps) {
  const [summary, setSummary] = useState<MonthlySummary | null>(mockData?.summary || null);
  const [transactions, setTx] = useState<Transaction[]>(mockData?.transactions || []);
  const [loading, setLoading] = useState(!mockData);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (mockData) return;

    const tg = window.Telegram?.WebApp;
    tg?.ready?.(); tg?.expand?.();
    const initData = tg?.initData;

    (async () => {
      try {
        const makeBody = (extra?: object) =>
          initData
            ? JSON.stringify({ initData, ...extra })
            : JSON.stringify({ ...extra });

        const [sRes, tRes] = await Promise.all([
          fetch("/api/summary",      { method: "POST", headers: { "Content-Type": "application/json" }, body: makeBody() }),
          fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: makeBody({ limit: 5 }) }),
        ]);
        if (!sRes.ok) throw new Error(await sRes.text());
        const [s, t] = await Promise.all([sRes.json(), tRes.json()]);
        setSummary(s); setTx(t);
      } catch { setError("Gagal memuat data. Coba lagi."); }
      finally { setLoading(false); }
    })();
  }, [mockData]);

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 32px", textAlign: "center" }}>
      <p style={{ fontSize: 40, color: "var(--text-3)", lineHeight: 1 }}>—</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Akses Terbatas</p>
      <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{error}</p>
    </div>
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="h-full overflow-y-auto" style={{ padding: "28px 16px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

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
        <Tip text="Ringkasan keuangan bulan ini — saldo, pemasukan & pengeluaran." />
        <div style={{ marginTop: 8 }}>
          {summary && <BalanceCard summary={summary} />}
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
          {summary && <CategoryChart data={summary.expense_by_category} />}
        </div>
        <Tip text="Ketuk potongan grafik untuk melihat nominal per kategori." />
      </div>

      {/* ── Recent Transactions ── */}
      <div className="fade-3">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase" }}>
            Transaksi Terbaru
          </p>
          <a href="/transactions" style={{ fontSize: 10, fontWeight: 600, color: "var(--text)", textDecoration: "none" }}>
            Lihat semua →
          </a>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "0 16px" }}>
          <TransactionList transactions={transactions} />
        </div>
        {transactions.length === 0 && (
          <Tip text="Belum ada transaksi. Tambahkan lewat bot Telegram." />
        )}
      </div>

    </div>
  );
}
