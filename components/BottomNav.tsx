"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/",
    label: "Overview",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transaksi",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "var(--surface)",
      borderTop: "1px solid var(--border-hi)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <div style={{
        display: "flex",
        maxWidth: 390,
        margin: "0 auto",
        height: "var(--nav-h)",
        padding: "0 12px",
        gap: 8,
        alignItems: "center",
      }}>
        {ITEMS.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                height: 50,
                borderRadius: 14,
                textDecoration: "none",
                transition: "all 0.2s ease",
                position: "relative",
                background: active ? "rgba(16,185,129,0.08)" : "transparent",
                border: active ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
                color: active ? "var(--income)" : "var(--text-2)",
              }}
            >
              {/* Active top indicator bar */}
              {active && (
                <span style={{
                  position: "absolute",
                  top: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 32,
                  height: 2,
                  background: "var(--income)",
                  borderRadius: "0 0 4px 4px",
                }} />
              )}
              <span style={{ opacity: active ? 1 : 0.5, transition: "opacity 0.2s" }}>
                {icon}
              </span>
              <span style={{
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: active ? 700 : 500,
                lineHeight: 1,
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
