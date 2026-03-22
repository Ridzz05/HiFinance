"use client";
import React from "react";
import { motion } from "framer-motion";
import { Brain, Camera, Mic, PieChart, Download } from "lucide-react";
import styles from "../../app/(marketing)/landing.module.css";

const features = [
  {
    title: "Natural Language AI",
    description: "Didukung Google Gemini. AI mem-parsing kalimat \"Beli kopi 25rb\" menjadi data terstruktur dalam sekejap.",
    icon: <Brain style={{ width: 20, height: 20 }}/>,
    className: `${styles.featColSpan2} ${styles.featGradientPrimary}`,
    iconColor: "#00E5FF"
  },
  {
    title: "Smart Receipt Scanner",
    description: "Vision AI membaca struk fisik otomatis via foto. Tinggal jepret, data langsung masuk.",
    icon: <Camera style={{ width: 20, height: 20 }}/>,
    className: styles.featGlass,
    iconColor: "#FFD600"
  },
  {
    title: "Voice Reporting",
    description: "Sedang nyetir atau jalan? Rekam pengeluaran lewat Voice Note di Telegram.",
    icon: <Mic style={{ width: 20, height: 20 }}/>,
    className: styles.featGlass,
    iconColor: "#FF3366"
  },
  {
    title: "TMA Dashboard",
    description: "Buka ringkasan keuangan langsung dari dalam chat Telegram dengan animasi fluid.",
    icon: <PieChart style={{ width: 20, height: 20 }}/>,
    className: styles.featGradientPrimary,
    iconColor: "#00E5FF"
  },
  {
    title: "Instant Export",
    description: "Satu klik untuk mengunduh laporan bulanan dalam format Excel CSV.",
    icon: <Download style={{ width: 20, height: 20 }}/>,
    className: styles.featGlass,
    iconColor: "#888888"
  }
];

export default function FeatureGrid() {
  return (
    <section className={`${styles.section} ${styles.featureSection} ${styles.container}`}>
      <div className={styles.sectionHeader} style={{ textAlign: "left" }}>
        <h2 className={styles.featureTitle}>
          Fitur Canggih yang <br className={styles.breakDesktop}/> Membuat Segalanya Lebih Cepat.
        </h2>
        <p className={styles.sectionSubtitle} style={{ margin: 0 }}>
          Dari AI canggih hingga notering suara, HiFinance hadir dengan alat yang menjamin pembukuan tidak lagi jadi beban.
        </p>
      </div>

      <div className={styles.featuresWrapper}>
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`${styles.featureCard} ${feature.className}`}
          >
            <div className={styles.featureIconBox} style={{ color: feature.iconColor }}>
              {feature.icon}
            </div>
            <div>
              <h3 className={styles.featureDescTitle}>{feature.title}</h3>
              <p className={styles.featureDescText}>{feature.description}</p>
            </div>
            
            <div className={styles.featureHoverGlow} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
