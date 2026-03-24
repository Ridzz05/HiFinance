"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, ScanLine, BarChart3, FileSpreadsheet, Shield, Zap, ArrowRight, PieChart, RefreshCcw, Search, Sparkles, Smartphone, Database, Instagram, Twitter, Youtube } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} 
from "@/components/ui/accordion";
import DashboardUI from "@/components/DashboardUI";

/* ─── Framer Motion reusable viewport-triggered wrapper ─── */
function FadeIn({ 
  children, 
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.6,
}: { 
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
}) {
  const directionMap = {
    up:    { y: 40, x: 0 },
    down:  { y: -40, x: 0 },
    left:  { y: 0, x: -40 },
    right: { y: 0, x: 40 },
    none:  { y: 0, x: 0 },
  };
  const offset = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Float animation variant for framer-motion ─── */
const floatVariants = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 1, 0],
    transition: {
      duration: 5,
      ease: "easeInOut" as const,
      repeat: Infinity,
    },
  },
};

const floatSlowVariants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, -1, 0],
    transition: {
      duration: 7,
      ease: "easeInOut" as const,
      repeat: Infinity,
    },
  },
};

/* ─── Stagger container for children ─── */
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

/* ─── Mock data (mirrors real TMA data shape) ─── */
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
    { category: "Rumah", amount: 2000000, percentage: 46.6 },
  ],
};

const MOCK_TXS = [
  { id: "1", type: "expense" as const, amount: 65000,   category: "Makanan",   note: "Makan siang yoshinoya",  created_at: "2026-03-24T12:30:00.000Z" },
  { id: "2", type: "income"  as const, amount: 5000000, category: "Gaji",      note: "Bonus project",          created_at: "2026-03-23T09:00:00.000Z" },
  { id: "3", type: "expense" as const, amount: 150000,  category: "Transport", note: "GoRide mingguan",         created_at: "2026-03-22T17:45:00.000Z" },
];

/* ─── FAQ data ─── */
const FAQS = [
  {
    q: "Bagaimana cara mencatat transaksi?",
    a: "Sangat mudah! Gunakan bahasa layaknya mengobrol biasa. Misalnya ketik 'Beli nasi goreng 25rb' atau 'Gajian 5 juta'. Gemini AI kami akan bersandar pada LLM untuk mengekstrak nominal, kategori, dan jenis transaksi secara instan.",
  },
  {
    q: "Bagaimana cara kerja fitur Scan Struk?",
    a: "Cukup kirimkan foto struk pembayaran Anda ke dalam chat. Bot menggunakan kapabilitas Gemini Vision AI untuk membaca merchant, mendeteksi daftar barang, dan menjumlahkan total belanja secara otomatis menjadi data pengeluaran.",
  },
  {
    q: "Apakah saya bisa memfilter riwayat transaksi?",
    a: "Tentu! Gunakan command /lihat untuk memfilter histori berdasarkan kategori spesifik (contoh: Makanan, Transport), atau /summary untuk melihat ringkasan agregat keuangan bulan berjalan, termasuk total pemasukan dan sisa saldo.",
  },
  {
    q: "Bagaimana jika ada kesalahan input data?",
    a: "Sistem kami menyediakan manajemen CRUD yang aman. Gunakan command /hapus untuk menghapus transaksi terakhir atau menghapus transaksi kategori tertentu melalui konfirmasi Inline Keyboard. Anda juga bisa menggunakan /reset untuk menghapus seluruh data secara permanen.",
  },
  {
    q: "Apakah datanya bisa diekspor?",
    a: "Ya. Melalui tombol WebApp di Telegram, Anda dapat membuka dashboard interaktif (TMA) ini. Di dalamnya terdapat fitur untuk melihat grafik porsi pengeluaran dan mengekspor seluruh laporan utuh dalam format Excel (.xlsx).",
  },
];

/* ─── Feature cards for bento grid ─── */
const BOT_FEATURES = [
  {
    title: "Pencatatan Natural Language",
    description: "Cukup ketik pesan sehari-hari seperti 'Makan ayam geprek 25rb'. LLM AI otomatis mengekstrak nominal, memprediksi jenis transaksi, dan mengklasifikasikan kategorinya. Tidak perlu pakai format kaku.",
    icon: MessageSquareText,
    span: "md:col-span-8 lg:col-span-6",
    glow: "from-aqua/20",
    color: "text-aqua",
  },
  {
    title: "Pemindaian Struk Belanja",
    description: "Malas mencatat barang belanjaan? Cukup jepret dan kirim foto struk ke bot. Vision AI kami akan mendeteksi nama merchant dan menjumlahkan total belanja seketika.",
    icon: ScanLine,
    span: "md:col-span-4 lg:col-span-6",
    glow: "from-purple-500/20",
    color: "text-purple-400",
  },
  {
    title: "Dashboard TMA Interaktif",
    description: "Tak perlu aplikasi eksternal. Kami menyediakan Telegram Mini App yang berjalan mulus dengan chart dinamis, statistik porsi pengeluaran, dan UI responsif ala aplikasi iOS modern.",
    icon: BarChart3,
    span: "md:col-span-12 lg:col-span-8",
    glow: "from-emerald-500/20",
    color: "text-emerald-400",
  },
  {
    title: "Rekap & Agregat Bulanan",
    description: "Akses command /summary untuk evaluasi kesehatan finansial langsung dari chat. Anda akan menerima total agregat serta sisa limit budget bulanan.",
    icon: PieChart,
    span: "md:col-span-6 lg:col-span-4",
    glow: "from-yellow-400/20",
    color: "text-yellow-400",
  },
  {
    title: "Filter & Riwayat Detail",
    description: "Cari riwayat transaksi berdasarkan kategori? Panggil /lihat, pilih kategori seperti Transportasi atau Makanan, lalu dapatkan daftar transaksinya.",
    icon: Search,
    span: "md:col-span-6 lg:col-span-4",
    glow: "from-blue-400/20",
    color: "text-blue-400",
  },
  {
    title: "Export Utuh via Excel",
    description: "Cetak laporan historis seluruh catatan transaksi dalam format komprehensif Excel (.xlsx) untuk digunakan dalam pembukuan atau audit akuntansi.",
    icon: FileSpreadsheet,
    span: "md:col-span-6 lg:col-span-4",
    glow: "from-indigo-400/20",
    color: "text-indigo-400",
  },
  {
    title: "Aman dengan Manajemen CRUD",
    description: "Manusiawi jika terjadi salah ketik. /hapus menghadirkan proteksi via Inline Keyboard untuk membatalkan catatan terakhir atau keseluruhan satu kategori tanpa repot.",
    icon: RefreshCcw,
    span: "md:col-span-6 lg:col-span-4",
    glow: "from-orange-400/20",
    color: "text-orange-400",
  },
  {
    title: "Hak Privasi Mutlak (Reset)",
    description: "Genggam kontrol mutlak atas riwayat data Anda di awan. Fitur /reset memastikan database Anda terhapus secara permanen jika Anda memutuskan untuk berhenti.",
    icon: Shield,
    span: "md:col-span-12 lg:col-span-12 text-center",
    glow: "from-rose-500/20",
    color: "text-rose-400",
  },
];

/* ────────────────────────────────── NAVBAR ────────────────────────────────── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_LINKS = [
    { label: "Fitur", href: "#features" },
    { label: "Cara Kerja", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/5"
    >
      <div className="flex h-16 w-full max-w-7xl mx-auto items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="#" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-aqua/20 shrink-0">
              <Image src="/logo/hifinance.png" alt="HiFinance Logo" width={40} height={40} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-50 tracking-tight">HiFinance Bot</span>
              <span className="text-[10px] font-medium text-aqua">@hifinance_bot</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-300 hover:text-aqua transition-colors">{link.label}</Link>
          ))}
        </nav>

        {/* Right side: CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="https://t.me/hifinance_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full bg-aqua px-5 py-2 text-sm font-bold text-slate-900 shadow-lg shadow-aqua/20 transition-all duration-300 hover:scale-105 hover:shadow-aqua/40"
          >
            Buka Bot
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 transition-colors hover:bg-aqua/10"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-slate-200 rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-200 rounded-full transition-all duration-300 mt-1 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-200 rounded-full transition-all duration-300 mt-1 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel — AnimatePresence for smooth mount/unmount */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden overflow-hidden border-t border-white/5"
          >
            <nav className="flex flex-col gap-1 px-6 py-4 bg-slate-950/95 backdrop-blur-xl">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-300 hover:text-aqua hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="mt-3 pt-3 border-t border-white/5"
              >
                <Link
                  href="https://t.me/hifinance_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-aqua px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-aqua/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Buka Bot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─────────────────────────────── HERO ────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-x-hidden pt-28 pb-20 flex items-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left: Copy */}
          <FadeIn direction="left" className="flex flex-col">
            {/* Live badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-aqua">Live on Telegram</span>
            </motion.div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-50 sm:text-6xl lg:text-7xl leading-[1.1]">
              Catat Keuangan<br />
              <span className="text-aqua">
                Semudah Chatting.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              Lupakan form aplikasi yang ribet. Cukup ketik &quot;Makan 25rb&quot; atau kirim foto struk belanja, dan biar kami yang menyusunnya rapi ke dalam dashboard Anda.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="https://t.me/hifinance_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-2xl bg-aqua px-8 py-4 text-sm font-bold text-slate-900 shadow-xl shadow-aqua/25 transition-all hover:scale-105 hover:shadow-aqua/40 active:scale-95"
              >
                Mulai Sekarang — Gratis
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/home#features" className="text-sm font-medium text-slate-400 hover:text-aqua transition-colors underline-offset-4 hover:underline">
                Lihat Fitur →
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6">
              {[
                { icon: Shield, label: "Privasi Terjamin" },
                { icon: Zap,    label: "Tanpa Install App Baru" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon className="h-4 w-4 text-aqua" />
                  {label}
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right: Phone mockup with real TMA components */}
          <FadeIn
            direction="up"
            delay={0.3}
            duration={0.8}
            className="perspective-1000 relative mx-auto flex justify-center w-full max-w-md lg:max-w-none lg:ml-auto"
          >
            {/* Floating analytics badge */}
            <motion.div
              variants={floatSlowVariants}
              animate="animate"
              className="absolute -right-4 top-1/4 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua/20 text-aqua">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-xs text-slate-400">Skor Kesehatan</p>
                <p className="text-sm font-bold text-aqua">Sangat Baik 🎉</p>
              </div>
            </motion.div>

            {/* Phone floating animation wrapper */}
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="relative w-full max-w-[340px]"
            >
              {/* Outer phone chassis */}
              <div className="relative rounded-[3rem] bg-linear-to-b from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 p-[3px] shadow-[0_0_80px_rgba(0,255,255,0.15)] border border-white/10">
                {/* Side button accents */}
                <div className="absolute -left-[5px] top-32 h-14 w-[5px] rounded-l-md bg-slate-800 border border-slate-600" />
                <div className="absolute -left-[5px] top-52 h-14 w-[5px] rounded-l-md bg-slate-800 border border-slate-600" />
                <div className="absolute -right-[5px] top-40 h-20 w-[5px] rounded-r-md bg-slate-800 border border-slate-600" />

                {/* Screen */}
                <div className="relative flex-1 flex col overflow-hidden rounded-[2.8rem] bg-charcoal shadow-inner aspect-9/19">

                  {/* Notch */}
                  <div className="absolute left-1/2 top-4 z-50 flex h-7 w-28 -translate-x-1/2 items-center justify-between rounded-full bg-black px-3 shadow-[0_1px_4px_rgba(255,255,255,0.1)] border border-white/5">
                    <div className="h-3 w-3 rounded-full bg-slate-800 opacity-50" />
                    <div className="h-3 w-3 rounded-full bg-aqua/20 shadow-[0_0_8px_#00FFFF]" />
                  </div>

                  {/* TMA content — authentic dashboard injection */}
                  <div className="w-full h-full pt-12 pb-8 pointer-events-none relative flex flex-col">
                    <DashboardUI mockData={{ summary: MOCK_SUMMARY, transactions: MOCK_TXS }} />

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-charcoal via-charcoal/80 to-transparent z-10" />
                  </div>
                </div>
              </div>

              {/* Glow ring under phone */}
              <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 h-10 w-4/5 rounded-full bg-aqua/20 blur-2xl" />
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── CORE CAPABILITIES (BENTO) ────────────────────────── */
function Capabilities() {
  return (
    <section id="features" className="py-32 w-full relative z-10 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-aqua/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center mb-24 max-w-3xl mx-auto">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-aqua" />
            <span className="text-xs font-semibold uppercase tracking-wider text-aqua">Menyeluruh & Powerful</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl leading-tight">
            Satu AI Bot untuk <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-aqua to-emerald-400">Semua Kebutuhan Finansialmu.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Kami membawa otomatisasi cerdas ke dalam grup obrolan pribadi Anda. Tanpa form rumit, hanya command ringkas di Telegram yang kaya akan fitur mumpuni.
          </p>
        </FadeIn>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {BOT_FEATURES.map((feat) => {
            const isFullWidthCenter = feat.span.includes("lg:col-span-12");
            
            return (
              <motion.div
                key={feat.title}
                variants={staggerItem}
                className={`group relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 ${feat.span} glass-card border border-white/10 hover:border-white/20 bg-slate-900/40`}
              >
                {/* Icon wrapper */}
                <div className={`mb-8 flex ${isFullWidthCenter ? "justify-center" : ""}`}>
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-colors shadow-lg group-hover:bg-white/10">
                    <feat.icon className={`h-8 w-8 ${feat.color} drop-shadow-[0_0_12px_currentColor]`} />
                  </div>
                </div>
                
                {/* Content */}
                <div className={`relative z-10 ${isFullWidthCenter ? "flex flex-col items-center text-center max-w-4xl mx-auto" : ""}`}>
                  <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">{feat.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-base">{feat.description}</p>
                </div>
                
                {/* Glow Background */}
                <div className={`absolute ${isFullWidthCenter ? 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2' : '-right-20 -top-20'} h-64 w-64 rounded-full blur-[100px] opacity-0 transition-opacity duration-700 group-hover:opacity-40 bg-linear-to-br ${feat.glow} to-transparent pointer-events-none`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── HOW IT WORKS ─────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Hubungkan di Telegram",
      desc: "Cari @hifinance_bot lalu tekan tombol mulai. Tanpa perlu mendaftar dengan email atau password panjang.",
      icon: Smartphone,
    },
    {
      num: "02",
      title: "Curhat Finansial",
      desc: "Ketik transaksi sesukamu—bahkan dengan gaya bahasa yang santai, AI kami memahaminya secara semantik.",
      icon: Database,
    },
    {
      num: "03",
      title: "Monitoring Berbasis Web",
      desc: "Buka Telegram WebApp untuk mengecek distribusi pengeluaran melalui chart dan diagram layaknya aplikasi asli.",
      icon: BarChart3,
    }
  ];

  return (
    <section id="how-it-works" className="py-24 w-full relative z-10 border-t border-white/5 bg-slate-950/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Left Text */}
          <FadeIn direction="left" className="md:w-1/3 text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-50 leading-tight">
              Bagaimana <br />
              <span className="text-aqua">Cara Kerjanya?</span>
            </h2>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Arsitektur cerdas yang menghubungkan kenyamanan obrolan Telegram dengan mesin AI yang tangguh di awan.
            </p>
          </FadeIn>

          {/* Right Steps */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 relative"
          >
            {/* Connecting Line (for desktop) */}
            <div className="hidden sm:block absolute top-[50px] left-[10%] w-[80%] h-px bg-linear-to-r from-transparent via-aqua/50 to-transparent z-0" />

            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative z-10 flex flex-col items-start bg-slate-900/80 p-8 rounded-3xl glass-card border border-white/5 shadow-2xl"
              >
                <div className="mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-700 shadow-inner">
                  <step.icon className="h-5 w-5 text-aqua" />
                </div>
                <h4 className="text-xl font-bold text-slate-50 mb-3">{step.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                
                {/* Big faded number */}
                <div className="absolute top-4 right-4 text-5xl font-black text-white/5 select-none pointer-events-none">
                  {step.num}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FAQ ──────────────────────────────────────── */
function FAQSection() {
  return (
    <section id="faq" className="py-32 w-full relative z-10">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
            Pertanyaan yang Sering <span className="text-aqua">Diajukan</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400">Ada yang bingung? Temukan jawabannya di sini.</p>
        </FadeIn>

        <FadeIn 
          direction="none"
          duration={0.7}
          className="rounded-3xl p-8 sm:p-12 shadow-2xl glass-card"
        >
          <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/10 pb-2 last:border-0 last:pb-0"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-50 hover:no-underline hover:text-aqua transition-colors py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-slate-400 pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FINAL CTA ────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative py-28 w-full overflow-hidden z-10">
      {/* Background glow for CTA */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-aqua/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-aqua/10 rounded-full blur-[120px] pointer-events-none" />

      <FadeIn direction="none" duration={0.8} className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-extrabold text-slate-50 sm:text-5xl tracking-tight leading-tight">
          Siap Mendisiplinkan <br className="hidden sm:block" />
          <span className="text-transparent text-aqua">
            Arus Kas Anda?
          </span>
        </h2>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          Tinggalkan cara manual. Cukup ketik layaknya sahabat, kirim foto struk, lalu pantau visualisasinya lewat Mini App Telegram.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="https://t.me/hifinance_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-aqua px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-aqua/25 transition-all hover:scale-105 hover:bg-aqua active:scale-95"
          >
            Mulai Percakapan di Telegram
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─────────────────────────────── FOOTER ──────────────────────────────────── */
function Footer() {
  const socials = [
    { name: "Instagram", href: "https://instagram.com/hifinance", icon: Instagram },
    { name: "Twitter", href: "https://twitter.com/hifinance", icon: Twitter },
    { name: "YouTube", href: "https://youtube.com/hifinance", icon: Youtube },
  ];

  return (
    <footer className="border-t border-white/10 pt-16 pb-8 relative z-10 bg-slate-950/50 mt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-aqua/20 shrink-0">
                <Image src="/logo/hifinance.png" alt="HiFinance Logo" width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <span className="text-xl font-bold text-slate-50 tracking-tight">HiFinance</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs text-center md:text-left leading-relaxed">
              Membawa manajemen keuangan cerdas langsung ke dalam obrolan Telegram Anda.
            </p>
          </div>

          {/* Socials & Bot Link */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-4">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-aqua hover:bg-aqua/10 hover:border-aqua/30 transition-all duration-300 shadow-lg"
                  title={social.name}
                >
                  <social.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </Link>
              ))}
              {/* Custom TikTok Icon */}
              <Link
                href="https://tiktok.com/@hifinance"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-aqua hover:bg-aqua/10 hover:border-aqua/30 transition-all duration-300 shadow-lg"
                title="TikTok"
              >
                <svg className="h-4 w-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 448 512">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between pt-8 border-t border-white/5">
          <p className="text-xs text-slate-500">
            Built with ❤️ by a Solo Dev for a Healthier Wallet. | <a href="https://macommerce.shop" target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline transition-colors">macommerce.shop</a>
          </p>  
          <div className="flex items-center gap-6 text-xs font-medium">
            <Link href="https://t.me/hifinance_bot" target="_blank" className="text-slate-400 hover:text-aqua transition-colors">
              Mulai Chat Server →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────── PAGE ─────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 font-sans antialiased selection:bg-aqua/30 overflow-hidden">
      {/* ── Ambient Background Layer ── */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        
        {/* Animated Ambient Orbs — now with framer-motion */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-aqua/10 blur-[160px]"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, delay: 2 }}
          className="absolute top-[40%] right-[-20%] h-[500px] w-[500px] rounded-full bg-aqua/10 blur-[140px]"
        />
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, delay: 4 }}
          className="absolute bottom-[-10%] left-[20%] h-[400px] w-[400px] rounded-full bg-yellow-400/5 blur-[120px]"
        />
      </div>

      {/* ── Foreground Content ── */}
      <div className="relative z-10 w-full">
        <Navbar />
        <main>
          <Hero />
          <Capabilities />
          <HowItWorks />
          <FAQSection />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
