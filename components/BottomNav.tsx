"use client";
// components/BottomNav.tsx — Nihilism style

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex max-w-lg mx-auto">
        {NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center py-3.5 gap-1 text-xs font-medium tracking-wide transition-all active:opacity-60"
              style={{
                color: active ? "var(--text)" : "var(--text-muted)",
                borderTop: active ? "2px solid var(--text)" : "2px solid transparent",
                marginTop: "-1px",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
