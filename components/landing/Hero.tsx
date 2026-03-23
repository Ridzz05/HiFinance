"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const MOCK_DATA = [
  { name: "Mon", balance: 4000 },
  { name: "Tue", balance: 3000 },
  { name: "Wed", balance: 5000 },
  { name: "Thu", balance: 4500 },
  { name: "Fri", balance: 6000 },
  { name: "Sat", balance: 5500 },
  { name: "Sun", balance: 7500 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden pt-32 pb-16 flex items-center">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

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
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
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
            {/* Phone Mockup Frame */}
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-[8px] border-slate-200 dark:border-slate-800 bg-[#0c0c0c] shadow-2xl shadow-cyan-500/20 aspect-[9/18] w-full max-w-[320px] mx-auto flex flex-col pt-8">
              {/* Fake notch */}
              <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-200 dark:bg-slate-800" />
              
              <div className="px-5 pb-4 text-white">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest text-center">HiFinance Mini App</p>
                <h3 className="text-2xl font-bold mt-2">Rp 12,450,000</h3>
                <p className="text-xs text-cyan-400 font-medium">+Rp 2.5jt bulan ini</p>
              </div>

              {/* Chart Visualization */}
              <div className="h-48 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ background: '#111', border: 'none', borderRadius: 8, fontSize: 12, color: '#fff' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Fake chat bubbles */}
              <div className="flex-1 bg-black/40 p-4 flex flex-col gap-3 justify-end rounded-t-3xl border-t border-white/5 backdrop-blur-sm relative z-20">
                <div className="self-end rounded-2xl rounded-tr-sm bg-cyan-600 px-4 py-2 max-w-[85%]">
                  <p className="text-sm text-white">Makan siang yoshinoya 65rb</p>
                </div>
                <div className="self-start rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-2 max-w-[85%]">
                  <p className="text-sm text-white">✅ Dicatat! <br/><span className="text-yellow-400">🍔 Makan & Minum: -Rp 65,000</span></p>
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
