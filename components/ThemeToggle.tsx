"use client";
// components/ThemeToggle.tsx
// Dark / Light / Night theme switcher — persists in localStorage

import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "night";

const THEMES: { key: Theme; label: string; symbol: string }[] = [
  { key: "dark",  label: "Dark",  symbol: "●" },
  { key: "night", label: "Night", symbol: "◐" },
  { key: "light", label: "Light", symbol: "○" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hf-theme") as Theme | null;
    if (saved) apply(saved);
  }, []);

  function apply(t: Theme) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("hf-theme", t);
    setTheme(t);
  }

  function cycle() {
    const idx = THEMES.findIndex(t => t.key === theme);
    apply(THEMES[(idx + 1) % THEMES.length].key);
  }

  const current = THEMES.find(t => t.key === theme)!;

  return (
    <button
      onClick={cycle}
      title={`Theme: ${current.label}`}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
      style={{
        background: "var(--btn-bg)",
        color: "var(--text-muted)",
        border: "1px solid var(--border)",
      }}
    >
      <span className="text-sm leading-none">{current.symbol}</span>
      <span>{current.label}</span>
    </button>
  );
}
