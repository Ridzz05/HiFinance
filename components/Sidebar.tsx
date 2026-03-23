"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Audit Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/transactions",
    label: "Semua Transaksi",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    href: "/",
    label: "Buka TMA",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8L22 12L18 16"/>
        <path d="M2 12H22"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      height: "100vh",
      position: "sticky",
      top: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border-hi)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      gap: 4,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 8 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "var(--income-dim)",
          border: "1px solid rgba(16,185,129,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--income)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", lineHeight: 1.1 }}>HiFinance</p>
          <p style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: "0.1em" }}>ADMIN</p>
        </div>
      </div>

      {/* Divider */}
      <p style={{ fontSize: 9, color: "var(--text-2)", letterSpacing: "0.2em", textTransform: "uppercase", paddingLeft: 8, marginBottom: 8 }}>
        Navigasi
      </p>

      {/* Nav Items */}
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = path === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              textDecoration: "none",
              transition: "all 0.2s ease",
              background: active ? "var(--income-dim)" : "transparent",
              border: active ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
              color: active ? "var(--income)" : "var(--text-2)",
            }}
          >
            <span style={{ opacity: active ? 1 : 0.6 }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, lineHeight: 1 }}>
              {label}
            </span>
            {active && (
              <span style={{
                marginLeft: "auto",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--income)",
              }} />
            )}
          </Link>
        );
      })}

      {/* Bottom spacer */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
        <p style={{ fontSize: 10, color: "var(--text-2)", paddingLeft: 8, lineHeight: 1.6 }}>
          HiFinance.ai · Audit Panel<br />
          <span style={{ opacity: 0.5 }}>v0.1.0 (dev)</span>
        </p>
      </div>
    </aside>
  );
}
