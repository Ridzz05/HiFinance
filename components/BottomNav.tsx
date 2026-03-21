"use client";
// components/BottomNav.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "night";
const CYCLE: Theme[] = ["dark", "night", "light"];
const SYMBOLS: Record<Theme, string> = { dark: "●", night: "◐", light: "○" };

function ThemeCycler() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("hf-theme") as Theme) ?? "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function cycle() {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hf-theme", next);
    setTheme(next);
  }

  return (
    <button
      onClick={cycle}
      className="flex flex-col items-center gap-1.5 py-4 px-4 transition-colors"
      style={{ color: "var(--text-muted)" }}
      aria-label="Ganti tema"
    >
      <span className="text-base leading-none" style={{ fontFamily: "monospace" }}>
        {SYMBOLS[theme]}
      </span>
      <span className="text-[9px] font-medium tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
        Tema
      </span>
    </button>
  );
}

const NAV_ITEMS = [
  {
    href: "/",
    label: "Overview",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transaksi",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: "var(--bg)", borderTop: "1px solid var(--border-mid)" }}
    >
      <div className="flex max-w-sm mx-auto">
        {/* Nav items */}
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1.5 py-4 transition-colors relative"
              style={{ color: isActive ? "var(--text)" : "var(--text-muted)" }}
            >
              {item.icon}
              <span
                className="text-[9px] font-medium tracking-widest uppercase"
                style={{ color: isActive ? "var(--text)" : "var(--text-muted)" }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-px"
                  style={{ background: "var(--text)" }}
                />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px my-3" style={{ background: "var(--border)" }} />

        {/* Theme cycler */}
        <ThemeCycler />
      </div>
    </nav>
  );
}
