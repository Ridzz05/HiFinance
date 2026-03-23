import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "HiFinance | Asisten Keuangan Pribadi",
  description: "Pantau dan urus keuangan semudah balas chat via Telegram atau Web.",
};

/**
 * TRUE ROOT LAYOUT — only owns <html> and <body>.
 * No CSS imports here. Each route group layout imports its own CSS.
 * This prevents globals.css TMA styles from leaking into /home.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("dark", inter.variable)}>
      <body className={cn("font-sans antialiased", inter.variable)}>
        {children}
      </body>
    </html>
  );
}
