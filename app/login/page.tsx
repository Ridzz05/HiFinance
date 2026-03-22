// app/login/page.tsx
// Halaman login untuk akses via browser — menggunakan Telegram Login Widget

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login — HiFinance",
  description: "Masuk ke HiFinance dengan akun Telegram kamu",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  // Kalau sudah login, langsung redirect ke dashboard
  const session = await getServerSession();
  if (session) redirect("/");

  const params = await searchParams;
  const error = params?.error;

  // URL bot name diambil dari env (tanpa @)
  const botName = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "hifinance_bot";
  // Callback URL ke API route kita
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/auth/telegram`;

  const errorMessages: Record<string, string> = {
    missing_params: "Data login tidak lengkap. Coba lagi.",
    invalid_auth: "Verifikasi Telegram gagal. Coba lagi.",
    db_error: "Gagal menyimpan data. Coba beberapa saat lagi.",
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        gap: "2rem",
        background: "var(--bg)",
      }}
    >
      {/* Logo & Branding */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          💰
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            margin: 0,
            color: "var(--text)",
          }}
        >
          HiFinance
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            margin: 0,
            fontSize: "0.95rem",
            maxWidth: 260,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Pantau keuangan kamu dengan cerdas, langsung dari Telegram.
        </p>
      </div>

      {/* Card login */}
      <div
        style={{
          width: "100%",
          maxWidth: 340,
          background: "var(--card)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              margin: "0 0 0.4rem",
              color: "var(--text)",
            }}
          >
            Masuk ke akunmu
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
            Gunakan akun Telegram kamu untuk masuk
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.25)",
              color: "#ff6b6b",
              fontSize: "0.85rem",
              textAlign: "center",
            }}
          >
            {errorMessages[error] ?? "Terjadi kesalahan. Coba lagi."}
          </div>
        )}

        {/* Telegram Login Widget */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}>
          {/* Widget resmi dari Telegram */}
          <script
            async
            src="https://telegram.org/js/telegram-widget.js?22"
            data-telegram-login={botName}
            data-size="large"
            data-auth-url={callbackUrl}
            data-request-access="write"
          />

          <noscript>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>
              JavaScript harus aktif untuk login dengan Telegram.
            </p>
          </noscript>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", width: "100%", paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
            Dengan masuk, kamu setuju dengan{" "}
            <span style={{ color: "var(--accent)" }}>Syarat Layanan</span>{" "}
            HiFinance. Data kamu aman dan tidak dibagikan ke pihak ketiga.
          </p>
        </div>
      </div>

      {/* CTA untuk yang punya bot */}
      <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
        Belum punya akun?{" "}
        <a
          href={`https://t.me/${botName}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
        >
          Mulai di Telegram →
        </a>
      </p>
    </div>
  );
}
