import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
