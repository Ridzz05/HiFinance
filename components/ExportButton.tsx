"use client";
// components/ExportButton.tsx

import { useState } from "react";

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) { alert("Buka melalui Telegram."); return; }
    setLoading(true);
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
    finally { setLoading(false); }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Export Excel"
      style={{
        width: 36, height: 36, borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--surface)", border: "1px solid var(--border-hi)",
        color: "var(--text-2)", cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.5 : 1, flexShrink: 0,
        transition: "opacity 0.15s",
      }}
    >
      {loading ? (
        <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      )}
    </button>
  );
}
