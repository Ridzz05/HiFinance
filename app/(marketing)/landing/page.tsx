import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CoreProblemSection from "@/components/landing/CoreProblemSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import WalletGuardian from "@/components/landing/WalletGuardian";
import FAQSection from "@/components/landing/FAQSection";
import TechTransparency from "@/components/landing/TechTransparency";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CoreProblemSection />
      <FeatureGrid />
      <WalletGuardian />
      <FAQSection />
      <TechTransparency />
      <FloatingWhatsApp />
    </main>
  );
}
