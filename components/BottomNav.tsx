"use client";
// components/BottomNav.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Beranda", icon: "⬡" },
  { href: "/transactions", label: "Transaksi", icon: "≡" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
      <div className="flex max-w-lg mx-auto">
        {NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all active:scale-95"
            >
              {/* Active pill */}
              <div className={`w-10 h-7 flex items-center justify-center rounded-xl text-base transition-all
                ${active
                  ? "text-white"
                  : ""}`}
                style={active ? { background: "var(--brand)" } : { color: "var(--text-muted)" }}>
                {item.icon}
              </div>
              <span className={`text-xs font-medium transition-colors
                ${active ? "" : ""}`}
                style={{ color: active ? "var(--brand)" : "var(--text-muted)" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
