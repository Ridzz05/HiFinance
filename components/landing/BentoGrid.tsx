"use client";

import { motion } from "framer-motion";
import { Mic, BrainCircuit, ScanLine, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Voice Recognition",
    description: "Cukup Ngomong, Langsung Dicatat.",
    icon: Mic,
    className: "col-span-1 lg:col-span-2 bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
  },
  {
    title: "NLP AI",
    description: "Paham Bahasa Manusia, Bukan Cuma Kode.",
    icon: BrainCircuit,
    className: "col-span-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10",
  },
  {
    title: "Vision OCR",
    description: "Foto Struk, Keluar Angka.",
    icon: ScanLine,
    className: "col-span-1 bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "Dashboard TMA",
    description: "Grafik Cantik di Dalam Genggaman.",
    icon: BarChart3,
    className: "col-span-1 lg:col-span-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10",
  },
];

export default function BentoGrid() {
  return (
    <section className="py-24 w-full bg-white dark:bg-[#0c0c0c] transition-colors relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Fitur Cerdas Tanpa Ribet
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            HiFinance bekerja layaknya asisten pribadi di Telegram.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 ${feature.className} p-8 hover:border-cyan-500/50 transition-all shadow-sm hover:shadow-cyan-500/10`}
            >
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
                  <feature.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  {feature.description}
                </p>
              </div>

              {/* Hover effect glow */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-[50px] transition-all group-hover:bg-cyan-400/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
