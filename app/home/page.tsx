"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquareText, ScanLine, BarChart3, FileSpreadsheet, Bot, Shield, Zap, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DashboardUI from "@/components/DashboardUI";

/* ─── Minimal IntersectionObserver wrapper for animate.css ─── */
function AnimatedSection({ 
  children, 
  animation = "animate__fadeInUp", 
  delay = "", 
  className = "",
  style = {}
}: { 
  children: React.ReactNode, 
  animation?: string, 
  delay?: string, 
  className?: string,
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${inView ? `animate__animated ${animation} ${delay}` : "opacity-0"}`}
      style={style}
    >
      {children}
    </div>
  );
}

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
const FEATURES = [
  {
    title: "AI Chat Tracker",
    description: "Cukup ketik pesan seperti 'Makan siang 25rb' atau 'Gajian 5 juta'. AI natural language kami akan otomatis membedah nominal, kategori, dan jenis transaksi. Tanpa form ribet!",
    icon: MessageSquareText,
    span: "md:col-span-8",
    glow: "from-aqua/20",
  },
  {
    title: "Scan Struk (Vision AI)",
    description: "Jepret dan kirim foto struk belanja. Bot akan mengekstrak total belanja dan merchant dalam hitungan detik.",
    icon: ScanLine,
    span: "md:col-span-4",
    glow: "from-aqua/20",
  },
  {
    title: "Dashboard Web (TMA)",
    description: "Grafik interaktif dan chart porsi pengeluaran langsung bisa diakses lewat menu Telegram Mini App.",
    icon: BarChart3,
    span: "md:col-span-4",
    glow: "from-aqua/20",
  },
  {
    title: "Rekap & Filter Cepat",
    description: "Pantau arus kas dengan command /summary atau cek histori kategori tertentu menggunakan /lihat.",
    icon: Bot,
    span: "md:col-span-4",
    glow: "from-aqua/20",
  },
  {
    title: "Export Laporan Excel",
    description: "Mempersiapkan laporan bulanan? Download seluruh data transaksimu dalam format .xlsx hanya dengan satu klik.",
    icon: FileSpreadsheet,
    span: "md:col-span-4",
    glow: "from-aqua/20",
  },
];

/* ────────────────────────────────── NAVBAR ────────────────────────────────── */
function Navbar() {
  return (
    <header className="animate__animated animate__fadeInDown fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/5">
      <div className="flex h-16 w-full max-w-7xl mx-auto items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-aqua/20 shrink-0">
            <Image src="/logo/hifinance.png" alt="HiFinance Logo" width={40} height={40} className="object-cover w-full h-full hover:scale-105 transition-transform" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-slate-50 tracking-tight">HiFinance Bot</span>
            <span className="text-[10px] font-medium text-aqua">@hifinance_bot</span>
          </div>
        </div>
        {/* CTA */}
        <Link
          href="https://t.me/hifinance_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-aqua px-5 py-2 text-sm font-bold text-slate-900 shadow-lg shadow-aqua/20 transition-all duration-300 hover:scale-105 hover:shadow-aqua/40"
        >
          Buka Bot
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

/* ─────────────────────────────── HERO ────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-x-hidden pt-28 pb-20 flex items-center">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full bg-aqua/10 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-aqua/8 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left: Copy */}
          <AnimatedSection animation="animate__fadeInLeft" className="flex flex-col">
            {/* Live badge */}
            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-aqua">Live on Telegram</span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-50 sm:text-6xl lg:text-7xl leading-[1.1]">
              Asisten Keuangan<br />
              <span className="text-aqua">
                Cerdas Berbasis AI.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              Catat transaksi dengan bahasa natural, pindai struk belanja via OCR, dan pantau ringkasan bulanan langsung lewat Telegram.
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
                { icon: Shield, label: "Data Terenkripsi" },
                { icon: Zap,    label: "Respons Instan"   },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon className="h-4 w-4 text-aqua" />
                  {label}
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: Phone mockup with real TMA components */}
          <AnimatedSection
            animation="animate__slideInUp"
            delay="animate__delay-1s"
            className="perspective-1000 relative mx-auto flex justify-center w-full max-w-md lg:max-w-none lg:ml-auto"
          >
            {/* Floating analytics badge */}
            <div className="animate__float absolute -right-4 top-1/4 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua/20 text-aqua">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-xs text-slate-400">Skor Kesehatan</p>
                <p className="text-sm font-bold text-aqua">Sangat Baik 🎉</p>
              </div>
            </div>

            {/* Phone floating animation wrapper */}
            <div className="animate__float relative w-full max-w-[340px]" style={{ animationDelay: "1s" }}>
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
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FEATURES (BENTO) ────────────────────────── */
function Features() {
  return (
    <section id="features" className="py-32 w-full bg-slate-950 relative z-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-slate-900/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
            Pencatatan Otomatis <span className="text-aqua">Tanpa Repot.</span>
          </h2>
          <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto">
            Diberdayakan oleh Aiogram, Gemini AI, dan Supabase Database, rasakan pengalaman manajemen keuangan mutakhir dari seutas chat.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden mt-12">
          {FEATURES.map((feat, i) => {
            const delayClass = i === 1 ? "animate__delay-1s" : i > 1 ? "animate__delay-2s" : "";
            return (
              <AnimatedSection
                key={feat.title}
                animation="animate__fadeInUp"
                delay={delayClass}
                className={`group relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${feat.span} glass-card`}
              >
                {/* Icon */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-colors shadow-lg group-hover:bg-aqua/10 group-hover:border-aqua/30">
                  <feat.icon className="h-7 w-7 text-aqua drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                </div>
                {/* Text */}
                <h3 className="mb-3 text-2xl font-bold text-slate-50 tracking-tight">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feat.description}</p>
                {/* Hover glow */}
                <div className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-linear-to-br ${feat.glow} to-transparent`} />
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FAQ ──────────────────────────────────────── */
function FAQSection() {
  return (
    <section className="py-32 w-full bg-slate-950 relative z-10">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl">
            Pertanyaan yang Sering <span className="text-aqua">Diajukan</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400">Ada yang bingung? Temukan jawabannya di sini.</p>
        </AnimatedSection>

        <AnimatedSection 
          animation="animate__zoomIn"
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
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FINAL CTA ────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative py-28 w-full bg-slate-950 overflow-hidden z-10">
      {/* Background glow for CTA */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-aqua/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-aqua/10 rounded-full blur-[120px] pointer-events-none" />

      <AnimatedSection animation="animate__zoomIn" className="relative mx-auto max-w-4xl px-6 text-center">
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
      </AnimatedSection>
    </section>
  );
}

/* ─────────────────────────────── FOOTER ──────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg shrink-0">
              <Image src="/logo/hifinance.png" alt="HiFinance Logo" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <span className="text-sm font-bold text-slate-50">HiFinance</span>
          </div>
          <p className="text-xs text-slate-500">© 2026 HiFinance. Dibuat dengan ❤️ untuk dompet yang lebih sehat.</p>
          <Link
            href="https://t.me/hifinance_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-aqua hover:text-aqua/80 transition-colors"
          >
            @hifinance_bot ↗
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────── PAGE ─────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans antialiased selection:bg-aqua/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
