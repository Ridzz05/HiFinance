"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "../../app/(marketing)/landing.module.css";

export default function TechTransparency() {
  return (
    <footer className={styles.techFooter}>
      <div className={styles.techContainer}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.techLogosRow}
        >
          {/* Mock Logos / Tech Stack text representation */}
          <span className={styles.techLogoItem}>Next.js 16</span>
          <span className={styles.techLogoItem}>Custom CSS</span>
          <span className={`${styles.techLogoItem} ${styles.colorSupabase}`}>Supabase</span>
          <span className={`${styles.techLogoItem} ${styles.colorTelegram}`}>Telegram API</span>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.techDesc}
        >
          Dibangun dengan pondasi arsitektur modern untuk <strong>kecepatan absolut</strong> dan <strong>keamanan tingkat tinggi</strong>. Menggunakan Next.js App Router, Styling Native CSS Modules yang solid, dipadukan dengan enkripsi dari Supabase demi menjaga privasi data finansial Anda.
        </motion.p>
        
        <div className={styles.techCopyright}>
          © 2026 HiFinance.ai — Asisten Finansial Era AI.
        </div>
      </div>
    </footer>
  );
}
