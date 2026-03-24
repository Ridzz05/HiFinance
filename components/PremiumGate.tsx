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
        
        {/* Gate Overlay (Glassmorphism & Adaptive Theme) */}
        <div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md shadow-2xl"
          style={{ 
            background: "color-mix(in srgb, var(--surface) 85%, transparent)",
            border: "1px solid var(--border-hi)"
          }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3 ring-1"
            style={{
              background: "var(--income-dim)",
              boxShadow: "0 0 15px var(--income-dim)",
              color: "var(--income)",
              borderColor: "color-mix(in srgb, var(--income) 40%, transparent)"
            }}
          >
            <Lock className="w-5 h-5" />
          </div>
          
          <h3 className="font-semibold text-lg mb-1 tracking-tight" style={{ color: "var(--text)" }}>
            Fitur Eksklusif
          </h3>
          
          <p className="text-xs sm:text-sm mb-5 leading-relaxed max-w-xs" style={{ color: "var(--text-2)" }}>
            Akses tingkat lanjut hanya untuk pengguna Guardian. Upgrade untuk membuka wawasan penuh!
          </p>
          
          <a
            href="/home#pricing" // Redirects to the Landing page pricing section
            className="font-bold py-2 px-5 rounded-full transition-all transform hover:scale-105 flex items-center gap-2 text-xs sm:text-sm"
            style={{
               background: "var(--income)",
               color: "var(--bg)",
               boxShadow: "0 0 20px var(--income-dim)"
            }}
          >
            Upgrade Guardian
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
