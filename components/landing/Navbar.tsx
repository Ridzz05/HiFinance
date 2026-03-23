"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ThemeToggle";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex h-16 w-full max-w-7xl mx-auto items-center justify-between px-6 transition-colors">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-inner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">HiFinance Bot</span>
            <span className="text-[10px] font-medium text-cyan-600 dark:text-cyan-400">@hifinance_bot</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link
            href="https://t.me/hifinance_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#00FFFF] to-slate-900 px-6 py-2.5 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#00FFFF] via-cyan-400 to-slate-800 opacity-0 transition duration-300 ease-out group-hover:opacity-100"></span>
            <span className="relative flex items-center gap-2 text-sm tracking-wide">
              Buka Bot
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
