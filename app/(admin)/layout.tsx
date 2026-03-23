import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";

/**
 * Admin Layout — segment layout for admin routes.
 * Imports globals.css for TMA theme vars.
 * Uses fragment wrapper (no html/body — that's in app/layout.tsx).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
