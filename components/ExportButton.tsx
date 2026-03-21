"use client";
// components/ExportButton.tsx
// Ekspor semua transaksi ke file Excel (.xlsx) langsung di client

import { useState } from "react";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string } };
  }
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

interface ExportButtonProps {
  className?: string;
}

export default function ExportButton({ className = "" }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      alert("Buka melalui bot Telegram untuk mengekspor data.");
      return;
    }

    setLoading(true);
    try {
      // Ambil semua transaksi (max 500)
      const [txRes, summaryRes] = await Promise.all([
        fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData, limit: 500 }),
        }),
        fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        }),
      ]);

      const transactions = await txRes.json();
      const summary = await summaryRes.json();

      // Import xlsx secara dinamis
      const XLSX = await import("xlsx");

      // Sheet 1: Semua Transaksi
      const txRows = transactions.map((tx: { created_at: string; type: string; category: string; amount: number; note: string }) => ({
        Tanggal: new Date(tx.created_at).toLocaleDateString("id-ID", {
          day: "2-digit", month: "long", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
        Jenis: tx.type === "income" ? "Pendapatan" : "Pengeluaran",
        Kategori: tx.category,
        Nominal: tx.amount,
        "Nominal (IDR)": formatRupiah(tx.amount),
        Catatan: tx.note || "-",
      }));

      // Sheet 2: Ringkasan per Kategori
      const catRows = (summary.expense_by_category || []).map((cat: { category: string; amount: number; percentage: number }) => ({
        Kategori: cat.category,
        Total: cat.amount,
        "Total (IDR)": formatRupiah(cat.amount),
        Persentase: `${cat.percentage}%`,
      }));

      // Buat workbook
      const wb = XLSX.utils.book_new();
      const wsTx = XLSX.utils.json_to_sheet(txRows);
      const wsCat = XLSX.utils.json_to_sheet([
        { Keterangan: "Periode", Nilai: summary.period?.label ?? "-" },
        { Keterangan: "Total Pendapatan", Nilai: formatRupiah(summary.total_income ?? 0) },
        { Keterangan: "Total Pengeluaran", Nilai: formatRupiah(summary.total_expense ?? 0) },
        { Keterangan: "Saldo", Nilai: formatRupiah(summary.balance ?? 0) },
        {},
        ...catRows,
      ]);

      // Set lebar kolom otomatis
      wsTx["!cols"] = [{ wch: 24 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 18 }, { wch: 30 }];
      wsCat["!cols"] = [{ wch: 20 }, { wch: 16 }, { wch: 20 }, { wch: 12 }];

      XLSX.utils.book_append_sheet(wb, wsTx, "Transaksi");
      XLSX.utils.book_append_sheet(wb, wsCat, "Ringkasan");

      const date = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `HiFinance_${date}.xlsx`);
    } catch (err) {
      console.error(err);
      alert("Gagal mengekspor data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
        bg-white/10 hover:bg-white/20 active:scale-95 transition-all
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Mengekspor...
        </>
      ) : (
        <>📥 Export Excel</>
      )}
    </button>
  );
}
