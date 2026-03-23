"use client";

import { motion } from "framer-motion";
import DashboardUI from "@/components/DashboardUI";

const MOCK_SUMMARY = {
  period: { year: 2026, month: 3, label: "Bulan Ini" },
  total_income: 12500000,
  total_expense: 4300000,
  balance: 8200000,
  transaction_count: 24,
  budget_limit: 8000000,
  expense_by_category: [
    { category: "Makanan", amount: 1500000, percentage: 34.8 },
    { category: "Transport", amount: 800000, percentage: 18.6 },
    { category: "Rumah", amount: 2000000, percentage: 46.5 }
  ]
};

const MOCK_TXS = [
  { id: "1", type: "expense" as const, amount: 65000, category: "Makanan", note: "Makan siang yoshinoya", created_at: "2026-03-24T12:30:00.000Z" },
  { id: "2", type: "income" as const, amount: 5000000, category: "Gaji", note: "Bonus project", created_at: "2026-03-23T09:00:00.000Z" },
  { id: "3", type: "expense" as const, amount: 150000, category: "Transport", note: "GoRide mingguan", created_at: "2026-03-22T17:45:00.000Z" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden pt-32 pb-16 flex items-center">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#00FFFF]/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#00FFFF]/10 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left: Typography */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            {/* Live Now Badge */}
            <div className="mb-6 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Live Now on Telegram
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              Urus Keuangan <br />
              <span className="bg-gradient-to-r from-[#00FFFF] to-blue-600 bg-clip-text text-transparent">
                Semudah Balas Chat.
              </span>
            </h1>
            
            <p className="mt-6 text-lg tracking-wide text-slate-600 dark:text-slate-400 sm:text-xl max-w-lg leading-relaxed">
              Asisten Pribadi yang bukan cuma nyatet, tapi jagain dompetmu tetap sehat. Semuanya otomatis dari genggamanmu.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <a
                href="https://t.me/hifinance_bot"
                className="group relative inline-flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-white px-8 py-4 font-semibold text-white dark:text-slate-900 transition-transform active:scale-95"
              >
                Mulai Sekarang Gratis
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Right: 3D Interactive Mockup / Recharts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="perspective-1000 relative mx-auto w-full max-w-md lg:max-w-none lg:ml-auto"
          >
            {/* Highly Realistic 3D Phone Mockup Frame */}
            <div className="relative z-10 mx-auto flex w-full max-w-[340px] flex-col overflow-visible rounded-[3rem] bg-gradient-to-b from-slate-200 to-slate-400 p-[3px] shadow-[0_0_80px_rgba(0,255,255,0.15)] dark:from-slate-700 dark:to-slate-900 border border-white/10 aspect-[9/19]">
              
              {/* Outer Volume/Power Buttons */}
              <div className="absolute -left-1.5 top-32 h-14 w-1.5 rounded-l border border-slate-600 bg-slate-800"></div>
              <div className="absolute -left-1.5 top-52 h-14 w-1.5 rounded-l border border-slate-600 bg-slate-800"></div>
              <div className="absolute -right-1.5 top-40 h-20 w-1.5 rounded-r border border-slate-600 bg-slate-800"></div>

              {/* Inner bezel and screen area */}
              <div className="relative flex-1 overflow-hidden rounded-[2.8rem] bg-[#0c0c0c] shadow-inner flex flex-col pt-1">
                
                {/* Dynamic Notch / Sensors */}
                <div className="absolute left-1/2 top-4 z-50 flex h-7 w-28 -translate-x-1/2 items-center justify-between rounded-full bg-black px-3 shadow-[0_1px_4px_rgba(255,255,255,0.1)] border border-white/5">
                  <div className="h-3 w-3 rounded-full bg-slate-800 opacity-50"></div>
                  <div className="h-3 w-3 rounded-full bg-[#00FFFF]/20 shadow-[0_0_8px_#00FFFF]"></div>
                </div>

                <div className="w-full h-full pt-12 pb-8 pointer-events-none relative flex flex-col">
                  {/* True Dashboard Injection */}
                  <DashboardUI mockData={{ summary: MOCK_SUMMARY, transactions: MOCK_TXS }} />

                  {/* Fade overlay at bottom of phone */}
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent z-10" />
                </div>
              </div>
            </div>

            {/* Decorative elements behind phone */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 rounded-2xl border border-white/10 bg-slate-800/80 p-4 backdrop-blur-xl shadow-xl z-20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400">AI Analysis</p>
                  <p className="text-sm font-bold text-white">Bagus! Sangat hemat.</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
