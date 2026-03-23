"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Kenapa harus Telegram?",
    answer: "Telegram cepat, ringan, dan gratis. Kamu tidak perlu instal aplikasi baru, cukup chat dan data keuanganmu otomatis tercatat dan tersinkronisasi. Platform ini juga sangat aman dan responsif di seluruh perangkat.",
  },
  {
    question: "Data saya aman?",
    answer: "Sangat aman. Kami menggunakan enkripsi kelas atas untuk melindungi semua riwayat transaksimu. Kami tidak pernah membagikan data pribadi atau finansial kamu kepada pihak ketiga, dan seluruh lalu lintas data diamankan melalui HTTPS.",
  },
  {
    question: "Apakah gratis digunakan?",
    answer: "Ya, versi dasar HiFinance dapat digunakan secara gratis tanpa iklan mengganggu. Untuk fitur analitik tingkat lanjut, kami menawarkan paket Pro yang sangat terjangkau.",
  },
];

export default function FAQ() {
  return (
    <section className="py-32 w-full bg-[#0c0c0c] relative z-10">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Pertanyaan yang Sering <span className="text-[#00FFFF]">Diajukan</span>
          </h2>
          <p className="mt-6 text-xl text-slate-400">
            Ada yang masih bingung? Cari tahu jawabannya di bawah.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 shadow-2xl"
        >
          <Accordion type="single" collapsible className="w-full flex flex-col gap-8">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:no-underline hover:text-[#00FFFF] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-slate-400 mt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
