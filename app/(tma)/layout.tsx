import BottomNav from "@/components/BottomNav";

export default function TMALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main style={{ maxWidth: 390, margin: "0 auto", width: "100%", paddingBottom: 80 }}>
        {children}
      </main>
      <BottomNav />
    </>
  );
}
