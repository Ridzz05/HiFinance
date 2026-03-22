"use client";
// app/transactions/page.tsx

import { useEffect, useState } from "react";
import TransactionList from "@/components/TransactionList";
import ThemeToggle from "@/components/ThemeToggle";
import { Transaction } from "@/lib/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } };
  }
}

type Filter = "all" | "income" | "expense";

const FILTERS: { key: Filter; label: string; hint: string }[] = [
  { key: "all",     label: "Semua",      hint: "Semua transaksi" },
  { key: "income",  label: "Masuk",      hint: "Pemasukan" },
  { key: "expense", label: "Keluar",     hint: "Pengeluaran" },
];

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

function ExportBanner({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px 20px",
        borderRadius: 16,
        background: "var(--surface)",
        border: "1px solid var(--border-hi)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
          Unduh Rekap Excel
        </p>
        <p style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.4 }}>
          Ekspor semua transaksi ke file .xlsx
        </p>
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0, marginLeft: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--pill-active-bg)", color: "var(--pill-active-text)",
      }}>
        {loading ? (
          <span style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
  const [transactions, setTx]   = useState<Transaction[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Filter>("all");
  const [exporting, setExporting] = useState(false);

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

  async function handleExport() {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) { alert("Buka melalui Telegram."); return; }
    setExporting(true);
    try {
      const [txRes, sumRes] = await Promise.all([
        fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData, limit: 500 }) }),
        fetch("/api/summary",      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData }) }),
      ]);
      const txs = await txRes.json();
      const sum = await sumRes.json();
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();
      const txRows = txs.map((tx: { created_at: string; type: string; category: string; amount: number; note: string }) => ({
        Tanggal: new Date(tx.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
        Jenis: tx.type === "income" ? "Pemasukan" : "Pengeluaran",
        Kategori: tx.category,
        Nominal: tx.amount,
        "Nominal (IDR)": fmtIDR(tx.amount),
        Catatan: tx.note || "-",
      }));
      const ws1 = XLSX.utils.json_to_sheet(txRows);
      ws1["!cols"] = [{ wch: 26 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 20 }, { wch: 30 }];
      const catRows = (sum.expense_by_category || []).map((c: { category: string; amount: number; percentage: number }) => ({
        Kategori: c.category, Total: c.amount, "Total (IDR)": fmtIDR(c.amount), Persentase: `${c.percentage}%`,
      }));
      const ws2 = XLSX.utils.json_to_sheet([
        { Keterangan: "Periode",           Nilai: sum.period?.label ?? "-" },
        { Keterangan: "Total Pemasukan",   Nilai: fmtIDR(sum.total_income ?? 0) },
        { Keterangan: "Total Pengeluaran", Nilai: fmtIDR(sum.total_expense ?? 0) },
        { Keterangan: "Saldo",             Nilai: fmtIDR(sum.balance ?? 0) },
        {}, ...catRows,
      ]);
      ws2["!cols"] = [{ wch: 20 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws1, "Transaksi");
      XLSX.utils.book_append_sheet(wb, ws2, "Ringkasan");
      XLSX.writeFile(wb, `HiFinance_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch { alert("Gagal ekspor. Coba lagi."); }
    finally { setExporting(false); }
  }

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);
  const counts = {
    all:     transactions.length,
    income:  transactions.filter(t => t.type === "income").length,
    expense: transactions.filter(t => t.type === "expense").length,
  };

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
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  flex: 1,
                  padding: "12px 4px",
                  borderRadius: 14,
                  border: `1px solid ${active ? "transparent" : "var(--border-hi)"}`,
                  background: active ? "var(--pill-active-bg)" : "var(--pill-bg)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s",
                }}
              >
                <span style={{
                  fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                  color: active ? "var(--pill-active-text)" : "var(--text)",
                  lineHeight: 1,
                }}>
                  {loading ? "—" : counts[key]}
                </span>
                <span style={{
                  fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: active ? "var(--pill-active-text)" : "var(--pill-text)",
                  fontWeight: 600,
                }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Transaction list ── */}
      <div className="fade-2">
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 20, padding: "0 16px" }}>
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
        {!loading && filtered.length > 0 && (
          <p style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.2em", color: "var(--text-2)", textTransform: "uppercase", marginTop: 12 }}>
            Menampilkan {filtered.length} transaksi
          </p>
        )}
      </div>

      {/* ── Export banner ── */}
      {!loading && (
        <div className="fade-3">
          <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 10 }}>
            Ekspor Data
          </p>
          <ExportBanner onClick={handleExport} loading={exporting} />
          <p style={{ fontSize: 10, color: "var(--text-2)", marginTop: 8, lineHeight: 1.5 }}>
            File Excel berisi 2 sheet: semua transaksi dan ringkasan per kategori.
          </p>
        </div>
      )}

    </div>
  );
}
