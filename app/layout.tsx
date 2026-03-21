// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "HiFinance",
  description: "Telegram Mini App untuk memantau keuangan pribadi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body>
        <ThemeProvider>
          <div className="max-w-sm mx-auto min-h-screen pb-20">
            {children}
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
