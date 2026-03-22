"use client";
// app/login/page.tsx — Client Component
// Form login/register dengan Username, Email, Password
// Mode dummy: accept any credentials, buat session, redirect ke dashboard

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/dummy-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan, coba lagi.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        gap: "1.5rem",
        background: "var(--bg)",
      }}
    >
      {/* Branding */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            margin: "0 auto 0.75rem",
          }}
        >
          💰
        </div>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            margin: "0 0 0.3rem",
            color: "var(--text)",
          }}
        >
          HiFinance
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.88rem" }}>
          Pantau keuangan kamu dengan cerdas
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 340,
          background: "var(--card)",
          borderRadius: 16,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Tab toggle */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {(["login", "register"] as Mode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setError(""); }}
              style={{
                flex: 1,
                padding: "0.85rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: mode === tab ? 700 : 400,
                color: mode === tab ? "var(--accent)" : "var(--text-muted)",
                borderBottom: mode === tab ? "2px solid var(--accent)" : "2px solid transparent",
                fontSize: "0.9rem",
                transition: "all 0.15s ease",
                marginBottom: -1,
              }}
            >
              {tab === "login" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
                Username
              </label>
              <input
                type="text"
                placeholder="ridzzdev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="kamu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "0.6rem 0.85rem",
                borderRadius: 8,
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.2)",
                color: "#ff6b6b",
                fontSize: "0.82rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem",
              borderRadius: 8,
              background: loading ? "var(--border)" : "var(--accent)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.15s",
              opacity: loading ? 0.7 : 1,
              marginTop: "0.25rem",
            }}
          >
            {loading ? "⏳ Sedang memproses..." : mode === "login" ? "Masuk →" : "Buat Akun →"}
          </button>
        </form>
      </div>

      {/* CTA Telegram */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 0.5rem" }}>
          Atau mulai langsung di Telegram
        </p>
        <a
          href="https://t.me/hifinance_bot"
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
            fontSize: "0.85rem",
            padding: "0.45rem 1rem",
            borderRadius: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
          </svg>
          Buka di Telegram
        </a>
      </div>
    </div>
  );
}
