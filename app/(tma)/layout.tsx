"use client";

import "@/app/globals.css";
import BottomNav from "@/components/BottomNav";
import { useEffect } from "react";

/**
 * TMA Layout — route group segment layout for Telegram Mini App.
 * Imports globals.css (TMA theme vars, BottomNav padding, dark theme).
 * Injects Telegram SDK via script + dark-theme init via localStorage.
 * Applies maxWidth 390px for mobile TMA viewport.
 *
 * NOTE: Cannot have its own <html>/<body> — those belong to app/layout.tsx.
 * Instead, this wraps children in a positioned div that enforces TMA constraints.
 */
export default function TMALayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inject Telegram SDK
    const existingScript = document.querySelector('script[src*="telegram-web-app"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Apply saved dark/light theme
    const t = localStorage.getItem("hf-theme") || "dark";
    document.documentElement.setAttribute("data-theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <main style={{ maxWidth: 390, margin: "0 auto", width: "100%", paddingBottom: 80 }}>
        {children}
      </main>
      <BottomNav />
    </>
  );
}
