"use client";
// components/BalanceCard.tsx

import { MonthlySummary } from "@/lib/types";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BalanceCard({ summary }: { summary: MonthlySummary }) {
  const isPositive = summary.balance >= 0;

  return (
    <div className="border border-white/8 rounded-2xl p-6 bg-[#0a0a0a]">
      {/* Period */}
      <p className="text-[10px] font-medium tracking-[0.2em] text-neutral-500 uppercase mb-6">
        {summary.period.label} · {summary.transaction_count} transaksi
      </p>

      {/* Balance */}
      <div className="mb-8">
        <p className="text-[11px] tracking-widest text-neutral-600 uppercase mb-2">Saldo</p>
        <p
          className="text-5xl font-bold tracking-tight leading-none"
          style={{ color: isPositive ? "#ffffff" : "#555555" }}
        >
          {isPositive ? "" : "−"}{formatRupiah(Math.abs(summary.balance))}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 mb-6" />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-0">
        <div className="pr-4 border-r border-white/5">
          <p className="text-[10px] tracking-widest text-neutral-600 uppercase mb-1.5">Masuk</p>
          <p className="text-base font-semibold text-white">
            +{formatRupiah(summary.total_income)}
          </p>
        </div>
        <div className="pl-4">
          <p className="text-[10px] tracking-widest text-neutral-600 uppercase mb-1.5">Keluar</p>
          <p className="text-base font-semibold text-neutral-400">
            −{formatRupiah(summary.total_expense)}
          </p>
        </div>
      </div>
    </div>
  );
}
