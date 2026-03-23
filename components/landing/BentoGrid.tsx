"use client";

import { motion } from "framer-motion";
import { Mic, BrainCircuit, ScanLine, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Voice & Text Recognition",
    description: "Cukup ngomong atau ketik seperti biasa. HiFinance langsung mengerti dan mencatat pengeluaranmu secara otomatis tanpa perlu isi form yang ribet.",
    icon: Mic,
    className: "md:col-span-2 md:row-span-2 flex flex-col justify-end p-10 min-h-[300px]",
    glow: "bg-[#00FFFF]/20"
  },
  {
    title: "NLP AI",
    description: "Memahami konteks layaknya manusia.",
    icon: BrainCircuit,
    className: "md:col-span-1 md:row-span-1 p-8",
    glow: "bg-[#00FFFF]/20"
  },
  {
    title: "Vision OCR",
    description: "Foto struk, keluar angka otomatis.",
    icon: ScanLine,
    className: "md:col-span-1 md:row-span-1 p-8",
    glow: "bg-[#00FFFF]/20"
  },
  {
    title: "Dashboard Interaktif",
    description: "Analisis visual yang mendalam. Pantau kesehatan finansialmu melalui grafik dinamis dan indikator peringatan cerdas langsung di layar smartphone kamu.",
    icon: BarChart3,
    className: "md:col-span-3 md:row-span-1 p-10 flex flex-col md:flex-row md:items-center gap-6",
    glow: "bg-yellow-400/20"
  },
];

export default function BentoGrid() {
  return (
    <section className="py-32 w-full bg-[#0c0c0c] relative z-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Satu Alat, <span className="text-[#00FFFF]">Sejuta Solusi.</span>
          </h2>
          <p className="mt-6 text-xl text-slate-400">
            Ekosistem pintar yang mengubah pesan sederhana menjadi analisis finansial tingkat tinggi.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 auto-rows-min">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all hover:border-[#00FFFF]/50 hover:shadow-[0_0_40px_rgba(0,255,255,0.1)] ${feature.className}`}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-inner transition-colors group-hover:bg-[#00FFFF]/10 group-hover:border-[#00FFFF]/30">
                  <feature.icon className="h-7 w-7 text-[#00FFFF]" />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 font-medium leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Hover effect glow */}
              <div className={`absolute -right-20 -top-20 h-56 w-56 rounded-full blur-[80px] transition-all opacity-0 group-hover:opacity-100 ${feature.glow}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
