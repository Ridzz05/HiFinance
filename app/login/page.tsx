// app/login/page.tsx
// Halaman login untuk akses via browser — menggunakan Telegram Login Widget

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import LoginWidget from "./LoginWidget";

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

        {/* Telegram Login Widget — Client Component agar script bisa execute */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}>
          <LoginWidget botName={botName} callbackUrl={callbackUrl} />
        </div>

        <div style={{ borderTop: "1px solid var(--border)", width: "100%", paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
            Dengan masuk, kamu setuju dengan{" "}
            <span style={{ color: "var(--accent)" }}>Syarat Layanan</span>{" "}
            HiFinance. Data kamu aman dan tidak dibagikan ke pihak ketiga.
          </p>
        </div>
      </div>

      {/* CTA untuk yang belum punya akun */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
          Belum pernah pakai HiFinance?
        </p>
        <a
          href={`https://t.me/${botName}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "white",
            background: "#2AABEE",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.88rem",
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {/* Telegram icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
          </svg>
          Mulai di Telegram
        </a>
      </div>
    </div>
  );
}
