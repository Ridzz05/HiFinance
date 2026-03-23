"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const IDR = (n: number) =>
  "Rp " + Math.abs(n).toLocaleString("id-ID", { maximumFractionDigits: 0 });

const COLORS = ["#10b981", "#f87171", "#fbbf24", "#60a5fa", "#a78bfa", "#fb923c"];

type Tx = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  note: string;
  created_at: string;
};

type StatCardProps = { label: string; value: string; color?: string; sub?: string };

function StatCard({ label, value, color, sub }: StatCardProps) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border-hi)",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      <p style={{ fontSize: 11, color: "var(--text-2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color: color ?? "var(--text)", letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "var(--text-2)" }}>{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "GET",
      });
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = transactions.filter((t) => {
    const d = new Date(t.created_at);
    const matchMonth = d.getMonth() + 1 === month && d.getFullYear() === year;
    const matchType = filter === "all" || t.type === filter;
    return matchMonth && matchType;
  });

  const totalIncome = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Build category data for chart
  const catMap: Record<string, number> = {};
  filtered.filter(t => t.type === "expense").forEach(t => {
    catMap[t.category] = (catMap[t.category] ?? 0) + t.amount;
  });
  const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

  const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  return (
    <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--text-2)", textTransform: "uppercase", marginBottom: 6 }}>AUDIT PANEL</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>
            Dashboard Keuangan
          </h1>
        </div>

        {/* Period Filter */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            style={{
              background: "var(--surface)", border: "1px solid var(--border-hi)", color: "var(--text)",
              borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none", cursor: "pointer",
            }}
          >
            {MONTH_NAMES.slice(1).map((n, i) => (
              <option key={i + 1} value={i + 1}>{n}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{
              background: "var(--surface)", border: "1px solid var(--border-hi)", color: "var(--text)",
              borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none", cursor: "pointer",
            }}
          >
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <StatCard label="Pemasukan" value={IDR(totalIncome)} color="var(--income)" sub={`${filtered.filter(t => t.type === "income").length} transaksi`} />
        <StatCard label="Pengeluaran" value={IDR(totalExpense)} color="var(--expense)" sub={`${filtered.filter(t => t.type === "expense").length} transaksi`} />
        <StatCard label="Saldo Bersih" value={IDR(balance)} color={balance >= 0 ? "var(--income)" : "var(--expense)"} sub={`${MONTH_NAMES[month]} ${year}`} />
      </div>

      {/* Charts */}
      {catData.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Bar Chart */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 16, padding: "20px 24px" }}>
            <p style={{ fontSize: 11, color: "var(--text-2)", letterSpacing: "0.15em", marginBottom: 16, textTransform: "uppercase" }}>Pengeluaran per Kategori</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catData}>
                <XAxis dataKey="name" tick={{ fill: "var(--text-2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 10 }}
                  labelStyle={{ color: "var(--text)", fontSize: 12 }}
                  formatter={(v: unknown) => [IDR(typeof v === "number" ? v : 0), "Pengeluaran"]}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 16, padding: "20px 24px" }}>
            <p style={{ fontSize: 11, color: "var(--text-2)", letterSpacing: "0.15em", marginBottom: 16, textTransform: "uppercase" }}>Proporsi Pengeluaran</p>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {catData.slice(0, 5).map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--text-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{IDR(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border-hi)", borderRadius: 16, overflow: "hidden" }}>
        {/* Table Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
            Transaksi ({filtered.length})
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "income", "expense"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: filter === f ? "var(--income-dim)" : "transparent",
                  borderColor: filter === f ? "rgba(16,185,129,0.3)" : "var(--border)",
                  color: filter === f ? "var(--income)" : "var(--text-2)",
                }}
              >
                {f === "all" ? "Semua" : f === "income" ? "Pemasukan" : "Pengeluaran"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ padding: "32px 24px", color: "var(--text-2)", fontSize: 13 }}>Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: "32px 24px", color: "var(--text-2)", fontSize: 13 }}>Tidak ada transaksi di periode ini.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Tanggal", "Jenis", "Kategori", "Catatan", "Nominal"].map(col => (
                    <th key={col} style={{
                      padding: "10px 24px", textAlign: "left",
                      fontSize: 10, color: "var(--text-2)", letterSpacing: "0.15em",
                      textTransform: "uppercase", fontWeight: 600,
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px 24px", fontSize: 12, color: "var(--text-2)" }}>
                      {new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </td>
                    <td style={{ padding: "12px 24px" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "3px 8px", borderRadius: 6,
                        background: t.type === "income" ? "var(--income-dim)" : "var(--expense-dim)",
                        color: t.type === "income" ? "var(--income)" : "var(--expense)",
                      }}>
                        {t.type === "income" ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 24px", fontSize: 13, color: "var(--text)" }}>{t.category}</td>
                    <td style={{ padding: "12px 24px", fontSize: 12, color: "var(--text-2)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.note || "—"}
                    </td>
                    <td style={{ padding: "12px 24px", fontSize: 14, fontWeight: 700, color: t.type === "income" ? "var(--income)" : "var(--expense)", textAlign: "right" }}>
                      {t.type === "income" ? "+" : "-"}{IDR(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
