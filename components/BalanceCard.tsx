"use client";
// components/BalanceCard.tsx
// Kartu utama yang menampilkan total income, expense, dan saldo

import { MonthlySummary } from "@/lib/types";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface BalanceCardProps {
  summary: MonthlySummary;
}

export default function BalanceCard({ summary }: BalanceCardProps) {
  const isPositive = summary.balance >= 0;

  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
      {/* Period label */}
      <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">
        {summary.period.label}
      </p>

      {/* Balance */}
      <div className="mb-5">
        <p className="text-indigo-200 text-sm mb-1">Saldo</p>
        <p className={`text-3xl font-bold tracking-tight ${isPositive ? "text-white" : "text-rose-300"}`}>
          {formatRupiah(summary.balance)}
        </p>
      </div>

      {/* Income / Expense row */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-xs">↑</span>
            <p className="text-indigo-100 text-xs">Pendapatan</p>
          </div>
          <p className="text-white font-semibold text-sm">{formatRupiah(summary.total_income)}</p>
        </div>
        <div className="flex-1 bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center text-xs">↓</span>
            <p className="text-indigo-100 text-xs">Pengeluaran</p>
          </div>
          <p className="text-white font-semibold text-sm">{formatRupiah(summary.total_expense)}</p>
        </div>
      </div>
    </div>
  );
}
