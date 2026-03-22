"use client";
import React from "react";
import { motion } from "framer-motion";
import { Bot, ArrowRight, Sparkles } from "lucide-react";
import styles from "../../app/(marketing)/landing.module.css";

export default function HeroSection() {
  return (
    <section className={`${styles.section} ${styles.heroSection} ${styles.container}`}>
      {/* Background glow */}
      <div className={`${styles.glowPrimary} ${styles.heroGlow}`} />
      
      <div className={styles.heroContent}>
        
        {/* Left: Copy & CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.heroLeft}
        >
          <div className={styles.heroBadge}>
            <Sparkles className={styles.heroBadgeIcon} />
            <span className={styles.heroBadgeText}>AI Financial Assistant</span>
          </div>

          <h1 className={styles.heroTitle}>
            Urus Keuangan <br className={styles.breakDesktop}/>
            <span className={styles.gradientText}>Semudah Balas Chat.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Asisten Pribadi yang bukan cuma nyatet, tapi jagain dompetmu tetap sehat dengan kekuatan AI.
          </p>

          <div className={styles.heroActions}>
            <a 
              href="https://t.me/hifinance_bot" 
              target="_blank" 
              rel="noreferrer"
              className={styles.primaryBtn}
            >
              <Bot style={{ width: 20, height: 20 }} />
              Coba di Telegram (Gratis)
            </a>
            <a 
              href="/dashboard"
              className={styles.secondaryBtn}
            >
              Lihat Dashboard Demo
              <ArrowRight className={styles.btnArrow} style={{ width: 16, height: 16 }} />
            </a>
          </div>
        </motion.div>

        {/* Right: Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={styles.heroRight}
        >
          {/* Mockup Container (Glassmorphism) */}
          <div className={styles.mockupContainer}>
             {/* Fake Telegram Chat bubble */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.8 }}
               className={styles.telegramBubbleRight}
             >
               "Beli kopi starbucks 50rb"
             </motion.div>

             {/* Fake Bot Reply bubble */}
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1.2 }}
               className={styles.telegramBubbleLeft}
             >
                <div className={styles.botHeader}>
                  <Bot style={{ width: 16, height: 16 }}/> <span className={styles.botName}>HiFinance AI</span>
                </div>
               <p className={styles.botText}>Sip! Dicatat sebagai pengeluaran <b>Food & Beverage</b> sebesar <b>Rp 50.000</b>.</p>
             </motion.div>

             {/* Fake Dashboard element */}
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1.6 }}
               className={styles.mockupDashboard}
             >
                <div className={styles.dashHandle} />
                <div className={styles.dashCharts}>
                  <div className={`${styles.chartBar} ${styles.bgAqua} ${styles.h12}`} />
                  <div className={`${styles.chartBar} ${styles.bgYellow} ${styles.h24}`} />
                  <div className={`${styles.chartBar} ${styles.bgAqua} ${styles.h16}`} />
                  <div className={`${styles.chartBar} ${styles.bgYellow} ${styles.h8}`} />
                </div>
             </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
