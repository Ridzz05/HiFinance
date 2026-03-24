"use client";
// app/transactions/page.tsx

import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import ThemeToggle from "@/components/ThemeToggle";
import { Transaction } from "@/lib/types";
import PremiumGate from "@/components/PremiumGate";

type Filter = "all" | "income" | "expense";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",     label: "Semua" },
  { key: "income",  label: "Masuk" },
  { key: "expense", label: "Keluar" },
];

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

/* ─── Skeleton atom ─── */
function S({ w = "100%", h = 14, r = 8 }: { w?: string | number; h?: number; r?: number }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }} />;
}

/* ─── Full-page skeleton for transactions ─── */
function TransactionsSkeleton() {
  return (
    <div style={{ padding: "28px 16px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <S w={90} h={10} />
          <S w={140} h={26} r={6} />
        </div>
        <S w={36} h={20} r={10} />
      </div>

      {/* Filter tabs skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <S w={200} h={10} />
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="skeleton" style={{
              flex: 1, height: 64, borderRadius: 14,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
            }} />
          ))}
        </div>
      </div>

      {/* List skeleton */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "12px 16px" }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
            <S w={38} h={38} r={10} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <S w="55%" h={13} r={4} />
              <S w="75%" h={11} r={4} />
            </div>
            <S w={55} h={13} r={4} />
          </div>
        ))}
      </div>

      {/* Export banner skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <S w={80} h={10} />
        <div className="skeleton" style={{ height: 72, borderRadius: 16 }} />
      </div>
    </div>
  );
}

/* ─── Export full-width banner ─── */
function ExportBanner({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative w-full overflow-hidden p-[16px_20px] rounded-2xl flex items-center justify-between border transition-all duration-300 ${
        loading 
          ? "opacity-60 cursor-not-allowed border-emerald-500/20 bg-slate-800/40" 
          : "cursor-pointer border-emerald-500/30 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md shadow-[0_4px_20px_rgba(16,185,129,0.1)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.2)]"
      }`}
    >
      <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="text-left relative z-10">
        <p className="text-[14px] font-bold text-white mb-1 flex items-center gap-2 tracking-tight">
          Unduh Rekap Excel
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            PRO
          </span>
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Ekspor semua transaksi bulanan ke format .xlsx
        </p>
      </div>
      <div className={`w-10 h-10 rounded-xl shrink-0 ml-4 flex items-center justify-center relative z-10 transition-transform duration-300 ${
        loading 
          ? "bg-slate-800 text-slate-400" 
          : "bg-linear-to-br from-emerald-500 to-emerald-400 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105"
      }`}>
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin inline-block" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        )}
      </div>
    </button>
  );
}

export default function TransactionsPage() {
  const [transactions, setTx]     = useState<Transaction[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<Filter>("all");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    // Dual-auth: kirim initData jika ada (Telegram), atau andalkan JWT cookie (browser)
    const body = initData
      ? JSON.stringify({ initData, limit: 50 })
      : JSON.stringify({ limit: 50 });

    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setTx)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleExport() {
    const initData = window.Telegram?.WebApp?.initData;
    setExporting(true);

    try {
      const body = initData
        ? JSON.stringify({ initData })
        : JSON.stringify({});

      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Gagal ekspor");
      }

      if (initData) {
        // Telegram Mini App → file dikirim ke chat, tampilkan notif
        alert("✅ File rekap sudah dikirim ke chat Telegram kamu!");
      } else {
        // Browser → download file langsung dari response
        const blob = await res.blob();
        const fileName = res.headers.get("Content-Disposition")
          ?.match(/filename="(.+?)"/)?.[1]
          ?? `HiFinance_${new Date().toISOString().split("T")[0]}.xlsx`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal ekspor. Coba lagi.";
      alert(msg);
    } finally {
      setExporting(false);
    }
  }



  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);
  const counts   = {
    all:     transactions.length,
    income:  transactions.filter(t => t.type === "income").length,
    expense: transactions.filter(t => t.type === "expense").length,
  };

  /* Show full-page skeleton while loading */
  if (loading) return <TransactionsSkeleton />;

  return (
    <div style={{ padding: "28px 16px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Header ── */}
      <div className="fade-0" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>
            HiFinance · Riwayat
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>
            Transaksi
          </h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, paddingTop: 2 }}>
          <ThemeToggle />
          <p style={{ fontSize: 8, color: "var(--text-2)", letterSpacing: "0.1em" }}>Tema</p>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="fade-1">
        <p style={{ fontSize: 10, color: "var(--text-2)", marginBottom: 10, lineHeight: 1.4 }}>
          Tap untuk menyaring berdasarkan jenis transaksi.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button key={key} onClick={() => setFilter(key)} style={{
                flex: 1, padding: "12px 4px", borderRadius: 14,
                border: `1px solid ${active ? "transparent" : "var(--border-hi)"}`,
                background: active ? "var(--pill-active-bg)" : "var(--pill-bg)",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4, transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: active ? "var(--pill-active-text)" : "var(--text)", lineHeight: 1 }}>
                  {counts[key]}
                </span>
                <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: active ? "var(--pill-active-text)" : "var(--pill-text)", fontWeight: 600 }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── List ── */}
      <div className="fade-2">
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "0 16px" }}>
          <TransactionList transactions={filtered} grouped />
        </div>
        {filtered.length > 0 && (
          <p style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", marginTop: 12 }}>
            {filtered.length} transaksi
          </p>
        )}
      </div>

      {/* ── Export ── */}
      <div className="fade-3">
        <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 10 }}>
          Ekspor Data
        </p>
        <PremiumGate requiredTier={["guardian", "founder"]}>
          <ExportBanner onClick={handleExport} loading={exporting} />
        </PremiumGate>
        <p style={{ fontSize: 10, color: "var(--text-2)", marginTop: 8, lineHeight: 1.5 }}>
          File .xlsx berisi 2 sheet: semua transaksi dan ringkasan kategori.
        </p>
      </div>

    </div>
  );
}
