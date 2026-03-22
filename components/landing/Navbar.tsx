"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun, Wallet } from "lucide-react";
import styles from "../../app/(marketing)/landing.module.css";
import Link from "next/link";

export default function Navbar() {
  const [theme, setTheme] = useState<'darkTheme' | 'lightTheme'>('darkTheme');

  useEffect(() => {
    // Check initial theme from parent node if possible, 
    // or just default to dark. Real app might check localStorage.
    const stored = localStorage.getItem('marketing-theme');
    if (stored === 'lightTheme') {
      setTheme('lightTheme');
      window.dispatchEvent(new CustomEvent('marketing-theme-toggle', { detail: 'lightTheme' }));
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'darkTheme' ? 'lightTheme' : 'darkTheme';
    setTheme(nextTheme);
    localStorage.setItem('marketing-theme', nextTheme);
    // Custom event caught by MarketingLayout
    window.dispatchEvent(new CustomEvent('marketing-theme-toggle', { detail: nextTheme }));
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navLogo}>
        <Wallet style={{ color: "#FFD600", width: 24, height: 24 }} />
        HiFinance
      </Link>

      <div className={styles.navActions}>
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
          {theme === 'darkTheme' ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
        </button>

        <Link href="/login" className={styles.loginBtn}>Masuk</Link>
        <Link href="/login" className={styles.signupBtn}>Daftar Gratis</Link>
      </div>
    </nav>
  );
}
