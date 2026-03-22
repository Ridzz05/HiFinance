"use client";
import React from "react";
import { motion } from "framer-motion";
import { Frown, Smile } from "lucide-react";
import styles from "../../app/(marketing)/landing.module.css";

export default function CoreProblemSection() {
  return (
    <section className={`${styles.section} ${styles.coreProblemSection} ${styles.container}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Mencatat Pengeluaran Harusnya Gampang.
        </h2>
        <p className={styles.sectionSubtitle}>
          Aplikasi keuangan tradisional terlalu ribet. Kami merombak total pengalamannya.
        </p>
      </div>

      <div className={styles.problemGrid}>
        {/* Old Way */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.cardOldWay}
        >
          <div className={styles.cardOldWayTopLine} />
          <div className={styles.cardHeader}>
            <div className={styles.cardIconOld}>
              <Frown style={{ width: 24, height: 24 }} />
            </div>
            <h3 className={styles.cardTitleOld}>Cara Lama (Form Kaku)</h3>
          </div>
          
          <ul className={styles.problemList}>
            <li className={styles.problemItem}>
              <span className={styles.problemCross}>×</span> Buka aplikasi & cari menu "Tambah Transaksi"
            </li>
            <li className={styles.problemItem}>
              <span className={styles.problemCross}>×</span> Isi form manual: Angka, Kategori, Tanggal
            </li>
            <li className={styles.problemItem}>
              <span className={styles.problemCross}>×</span> Pusing mengkategorikan setiap pengeluaran kecil
            </li>
          </ul>
        </motion.div>

        {/* HiFinance Way */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.cardNewWay}
        >
          <div className={styles.cardNewWayTopLine} />
          <div className={styles.cardNewWayGlow} />
          
          <div className={styles.cardHeader}>
            <div className={styles.cardIconNew}>
              <Smile style={{ width: 24, height: 24 }} />
            </div>
            <h3 className={styles.cardTitleNew}>HiFinance Way</h3>
          </div>
          
          <ul className={styles.problemList}>
            <li className={styles.solutionItem}>
              <span className={styles.solutionCheck}>✓</span> Cukup ketik "Gofood kfc 80rb" di Telegram
            </li>
            <li className={styles.solutionItem}>
              <span className={styles.solutionCheck}>✓</span> Atau kirim Voice Note (Bicara langsung)
            </li>
            <li className={styles.solutionItem}>
              <span className={styles.solutionCheck}>✓</span> AI Otomatis ekstrak angka & kategori. Selesai!
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
