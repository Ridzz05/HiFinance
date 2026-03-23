import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0c0c0c] pt-24 pb-12 overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-56 w-[80%] max-w-4xl rounded-full bg-[#00FFFF]/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-8 relative z-10 flex flex-col gap-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00FFFF] to-blue-600 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">HiFinance Bot</span>
            </div>
            <p className="text-base text-slate-400 max-w-sm mb-8 leading-relaxed">
              Asisten Pribadi yang bukan cuma nyatet, tapi jagain dompetmu tetap sehat.
            </p>
            <div className="flex items-center gap-8">
              <a href="https://instagram.com/hifinance.ai" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#00FFFF] transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Sitemap */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Sitemap</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-slate-400 hover:text-[#00FFFF] transition-colors">
                  Dashboard TMA
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="text-slate-400 hover:text-[#00FFFF] transition-colors">
                  Riwayat Transaksi
                </Link>
              </li>
              <li>
                <a href="https://t.me/hifinance_bot" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#00FFFF] transition-colors">
                  Buka Telegram Bot
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-[#00FFFF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-[#00FFFF] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HiFinance. All rights reserved.
          </p>

          <p className="text-sm text-slate-400 font-medium text-center sm:text-left">
            Built with ❤️ by a Solo Dev for a Healthier Wallet. <a href="https://macommerce.shop" target="_blank" rel="noopener noreferrer" className="text-[#00FFFF] hover:underline ml-1">Visit macommerce.shop</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
