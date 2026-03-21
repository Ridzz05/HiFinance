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
        {/* Prevent theme flash before hydration */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('hf-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})()`}} />
      </head>
      <body>
        {/* Single centred column, max 390px (typical mobile width) */}
        <main style={{ maxWidth: 390, margin: "0 auto", width: "100%" }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
