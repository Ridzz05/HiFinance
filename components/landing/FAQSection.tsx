"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "../../app/(marketing)/landing.module.css";

const faqs = [
  {
    question: "Apakah aplikasi ini gratis?",
    answer: "Ya, versi dasar HiFinance (Telegram Bot dan Dashboard TMA) bisa digunakan 100% secara gratis selamanya. Kami juga akan merilis fitur Premium di masa depan untuk analitik yang lebih dalam."
  },
  {
    question: "Bagaimana cara bot mencatat pengeluaran secara otomatis?",
    answer: "Kami menggunakan Google Gemini AI. Anda hanya perlu chat dengan kata-kata natural (misal: 'Beli bensin 20rb'). AI akan otomatis mengidentifikasi kategori, nominal, dan tanggal tanpa perlu form manual."
  },
  {
    question: "Apakah data finansial saya aman?",
    answer: "Sangat aman. Kami menggunakan enkripsi kelas militer dari Supabase untuk melindungi data. Percakapan di Telegram juga terenkripsi, dan kami tidak pernah menjual data finansial pengguna."
  },
  {
    question: "Apakah saya perlu menginstal aplikasi tambahan di HP?",
    answer: "Tidak! Anda hanya membutuhkan aplikasi Telegram. HiFinance terintegrasi langsung dengan Telegram Mini App, sehingga terasa seperti aplikasi Native tanpa memakan storage HP Anda."
  }
];

function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0], isOpen: boolean, onClick: () => void }) {
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={onClick}>
        <span>{faq.question}</span>
        <ChevronDown 
          className={styles.faqIcon} 
          style={{ width: 24, height: 24, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.faqAnswerBox}
          >
            <div className={styles.faqAnswer}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`${styles.section} ${styles.faqSection} ${styles.container}`}>
      <div className={styles.faqContainer}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pertanyaan Populer</h2>
          <p className={styles.sectionSubtitle}>Semua yang perlu Anda ketahui tentang HiFinance.ai.</p>
        </div>
        
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              faq={faq} 
              isOpen={openIndex === index} 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
