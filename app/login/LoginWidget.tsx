"use client";
// app/login/LoginWidget.tsx
// Client Component — Telegram Login Widget harus dijalankan di browser (bukan SSR)

import Script from "next/script";

interface LoginWidgetProps {
  botName: string;
  callbackUrl: string;
}

export default function LoginWidget({ botName, callbackUrl }: LoginWidgetProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
        minHeight: 56, // Placeholder saat widget load
      }}
    >
      {/* Telegram Login Widget resmi — butuh Client Component agar script bisa execute */}
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        strategy="afterInteractive"
        data-telegram-login={botName}
        data-size="large"
        data-auth-url={callbackUrl}
        data-request-access="write"
        data-radius="10"
      />
      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, textAlign: "center" }}>
        Klik tombol di atas untuk masuk dengan akun Telegram kamu
      </p>
    </div>
  );
}
