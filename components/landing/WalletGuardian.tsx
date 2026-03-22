"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, TrendingDown } from "lucide-react";
import styles from "../../app/(marketing)/landing.module.css";

export default function WalletGuardian() {
  return (
    <section className={`${styles.section} ${styles.guardianSection} ${styles.container}`}>
      {/* Background Effect */}
      <div className={`${styles.glowAccent}`} style={{ right: 0, top: '50%', transform: 'translateY(-50%)', width: '50%', height: '800px' }} />

      <div className={styles.guardianFlex}>
        
        {/* Visual Side */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.guardianVisual}
        >
          <div className={styles.guardianMockupBox}>
            {/* Alert Mockup */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className={styles.alertWidget}
            >
              <div className={styles.alertWidgetHeader}>
                <div className={styles.alertIconBox}>
                  <ShieldAlert style={{ color: "#FFD600", width: 20, height: 20 }} />
                </div>
                <div>
                  <h4 className={styles.alertTitle}>
                    Peringatan Anggaran <span className={styles.alertPulse} />
                  </h4>
                  <p className={styles.alertText}>
                    Pengeluaran kategori <b>Food & Beverage</b> sudah mencapai 85% dari batas bulanan.
                  </p>
                </div>
              </div>
              
              <div className={styles.progressBarBox}>
                <div className={styles.progressBarFill} style={{ width: '85%' }} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.guardianTextSide}
        >
          <div className={styles.guardianBadge}>
            <TrendingDown style={{ width: 16, height: 16 }} />
            Wallet Guardian
          </div>
          
          <h2 className={styles.guardianHeroText}>
            Kami Menjaga <br className={styles.breakDesktop}/> Dompet Anda agar <br className={styles.breakDesktop}/> Tetap Sehat.
          </h2>
          
          <p className={styles.guardianDesc}>
            HiFinance bukan sekadar buku catatan, melainkan penasihat keuangan proaktif Anda. Dapatkan <strong style={{color:"white", fontWeight:500}}>Real-time Alerts</strong> sebelum pengeluaran tak terduga menghancurkan anggaran, serta skor bulanan mengenai <strong style={{color:"white", fontWeight:500}}>Financial Health</strong> Anda.
          </p>
          
          <div className={styles.guardianHighlights}>
            <div className={styles.highlightItem}>
              <div className={styles.dotAqua} />
              <span>Identifikasi "Needs" vs "Wants" Secara Otomatis.</span>
            </div>
            <div className={styles.highlightItem}>
              <div className={styles.dotYellow} />
              <span>Kontrol Penuh Limit Anggaran Bulanan.</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
