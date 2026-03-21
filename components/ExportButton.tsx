"use client";
// components/ExportButton.tsx
// Ekspor data keuangan — bot akan mengirimkan file Excel langsung ke chat Telegram

import { useState } from "react";

type TelegramWebApp = {
  initData?: string;
  ready?: () => void;
  expand?: () => void;
  showAlert?: (msg: string, cb?: () => void) => void;
};

function getTelegramWebApp(): TelegramWebApp | undefined {
  return (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } })
    ?.Telegram?.WebApp;
}

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    const tg = getTelegramWebApp();
    const initData = tg?.initData;

    if (!initData) {
      window.alert("Buka melalui bot Telegram untuk mengekspor data.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengekspor");

      const msg = `✅ Dokumen berhasil dikirim!\n\nFile "${data.fileName}" sudah dikirim ke chat Telegram kamu.\n\n📊 Total: ${data.totalRows} transaksi`;
      tg?.showAlert ? tg.showAlert(msg) : window.alert(msg);

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengekspor data.";
      const errMsg = `❌ ${msg}\n\nCoba lagi beberapa saat.`;
      tg?.showAlert ? tg.showAlert(errMsg) : window.alert(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Export Excel"
      style={{
        width: 36, height: 36, borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--surface)", border: "1px solid var(--border-hi)",
        color: "var(--text-2)", cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.5 : 1, flexShrink: 0,
        transition: "opacity 0.15s",
      }}
    >
      {loading ? (
        <span style={{
          width: 14, height: 14,
          border: "2px solid currentColor", borderTopColor: "transparent",
          borderRadius: "50%", display: "inline-block",
          animation: "spin 0.7s linear infinite",
        }} />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      )}
    </button>
  );
}
