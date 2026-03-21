// app/layout.tsx
// Root layout — inisialisasi Telegram WebApp SDK

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HiFinance — Dashboard Keuangan",
  description: "Telegram Mini App untuk memantau keuangan pribadi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Telegram WebApp SDK — wajib untuk akses initData */}
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="max-w-lg mx-auto min-h-screen pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
