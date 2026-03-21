"use client";
// components/ThemeToggle.tsx — compact toggle, dark ↔ light

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("hf-theme");
    const isDark = saved !== "light";
    setDark(isDark);
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hf-theme", next);
    setDark(!dark);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: dark ? "#222" : "#ddd",
        border: "1px solid var(--border-hi)",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: dark ? 18 : 2,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: dark ? "#fff" : "#000",
          transition: "left 0.2s, background 0.2s",
        }}
      />
    </button>
  );
}
