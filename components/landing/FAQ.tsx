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
    <section className="py-24 w-full bg-slate-50 dark:bg-black transition-colors">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Ada yang masih bingung? Cari tahu jawabannya di bawah.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] p-6 sm:p-10 shadow-sm"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-200 dark:border-white/10 last:border-0">
                <AccordionTrigger className="text-left text-[16px] font-semibold text-slate-900 dark:text-white hover:no-underline hover:text-cyan-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
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
