"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/",
    label: "Overview",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex max-w-[390px] mx-auto h-[70px] px-4 items-center justify-around">
        {ITEMS.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link 
              key={href} 
              href={href} 
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 mx-1 rounded-2xl transition-all duration-300 ${
                active 
                  ? "bg-secondary text-[#00E5FF] border border-[#00E5FF]/30 shadow-sm shadow-[#00E5FF]/10 scale-105" 
                  : "text-muted-foreground border border-transparent hover:bg-secondary/30 hover:text-foreground"
              }`}
            >
              <div className={`${active ? "opacity-100" : "opacity-70"}`}>
                {icon}
              </div>
              <span className={`text-[10px] tracking-widest uppercase font-bold ${active ? "text-foreground" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
