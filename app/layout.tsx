// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "HiFinance",
  description: "Dashboard keuangan pribadi Telegram Mini App",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#7c5cfc" />
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body>
        <div className="max-w-lg mx-auto min-h-screen" style={{ paddingBottom: "80px" }}>
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
