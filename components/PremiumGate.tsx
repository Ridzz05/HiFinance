"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useTelegramUser } from "@/hooks/useTelegramUser";

interface PremiumGateProps {
  children: ReactNode;
  /**
   * List of allowed tiers. e.g. ["guardian", "founder"]
   * Defaults to ["guardian", "founder"]
   */
  requiredTier?: string[];
}

export default function PremiumGate({ 
  children, 
  requiredTier = ["guardian", "founder"] 
}: PremiumGateProps) {
  const { tier, isLoading, isError } = useTelegramUser();

  if (isLoading) {
    // Elegant skeleton loader state for premium components
    return (
      <div className="animate-pulse bg-slate-800/20 border border-slate-700/30 rounded-2xl h-48 w-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
      </div>
    );
  }

  // If error occurred fetching auth or the user's tier is not in the allowed list
  if (isError || !requiredTier.includes(tier.toLowerCase())) {
    return (
      <div className="relative rounded-2xl overflow-hidden group">
        {/* The locked content (blurred permanently to entice the user) */}
        <div className="blur-sm opacity-30 select-none pointer-events-none transition-all duration-500 saturate-50">
          {children}
        </div>
        
        {/* Gate Overlay (Glassmorphism) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-slate-900/80 backdrop-blur-md border border-white/5 shadow-2xl">
          
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 ring-1 ring-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          
          <h3 className="text-white font-semibold text-lg mb-1 tracking-tight">Fitur Eksklusif</h3>
          
          <p className="text-slate-400 text-xs sm:text-sm mb-5 leading-relaxed max-w-xs">
            Akses tingkat lanjut hanya untuk pengguna Guardian. Upgrade untuk membuka wawasan penuh!
          </p>
          
          <a
            href="/home#pricing" // Redirects to the Landing page pricing section
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-900 font-bold py-2 px-5 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 text-xs sm:text-sm"
          >
            Upgrade Guardian
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
