"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0c0c] flex flex-col font-sans transition-colors selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero />
        <BentoGrid />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
