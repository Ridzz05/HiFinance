// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "HiFinance",
  description: "Pantau keuangan via Telegram",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
        {/* Prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){var t=localStorage.getItem('hf-theme')||'dark';
          document.documentElement.setAttribute('data-theme',t);})()
        `}} />
      </head>
      <body>
        <div className="max-w-sm mx-auto min-h-screen pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
