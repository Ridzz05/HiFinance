"use client";
import React, { useState, useEffect } from "react";
import styles from './landing.module.css';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'darkTheme' | 'lightTheme'>('darkTheme');
  
  // Listen for custom event or context equivalent for theme changes
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setTheme(e.detail);
    };
    window.addEventListener('marketing-theme-toggle', handleThemeChange);
    return () => window.removeEventListener('marketing-theme-toggle', handleThemeChange);
  }, []);

  return (
    <div className={`${styles.marketingLayout} ${styles[theme]}`}>
      {children}
    </div>
  );
}
