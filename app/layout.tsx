import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "HiFinance | Asisten Keuangan Pribadi",
  description: "Pantau dan urus keuangan semudah balas chat via Telegram atau Web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("dark", "font-sans", geist.variable)}>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('hf-theme')||'dark';document.documentElement.setAttribute('data-theme',t);if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})()`}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
