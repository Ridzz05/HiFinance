import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HiFinance | Asisten Keuangan Pribadi",
  description: "Pantau dan urus keuangan semudah balas chat via Telegram atau Web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
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
