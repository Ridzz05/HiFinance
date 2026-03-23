"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [budgetLimit, setBudgetLimit] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.();
    const initData = tg?.initData;

    (async () => {
      try {
        const body = initData ? JSON.stringify({ initData }) : "{}";
        const res = await fetch("/api/settings", {
          method: "POST", // API settings GET doesn't seem to pass initData easily in Next App Router without queries, so we use POST for everything or just standard headers. Let's use POST. But wait, I only wrote POST in route.ts taking body. Oh wait, my GET takes {} but POST takes body. Let me just use POST to fetch if we pass action: 'get' or modify GET. Wait! Let's just use POST to save and GET to fetch. But GET doesn't take body!
        });
        
        // Actually, let's use a simpler approach. Just a standard fetch.
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (initData) headers["x-telegram-init-data"] = initData; // If API supports it

        const fetchRes = await fetch("/api/settings", { headers });
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          setBudgetLimit(data.budget_limit?.toString() || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData;

    try {
      const payload = {
        initData,
        budget_limit: Number(budgetLimit)
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan pengaturan");
      setMessage({ text: "Berhasil disimpan!", type: "success" });
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-black">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0c0c0c] text-white p-6 font-sans">
      <div className="flex items-center mb-8 gap-4">
        <button onClick={() => router.back()} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Wallet</h1>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-lg font-semibold text-cyan-400 mb-2">Wallet Guardian</h2>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Tentukan batas pengeluaran bulananmu. HiFinance akan memantau kesehatan finansialmu dan memberikan peringatan kuning jika kamu mendekati batas.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="budget" className="text-sm font-semibold text-slate-300">
              Batas Pengeluaran Bulanan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
              <input
                id="budget"
                type="number"
                min="0"
                step="50000"
                required
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="5000000"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              />
            </div>
          </div>

          {message.text && (
            <div className={`rounded-xl p-4 text-sm font-medium ${message.type === 'success' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 flex w-full items-center justify-center rounded-2xl bg-cyan-500 py-4 font-bold text-black hover:bg-cyan-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </form>
      </div>
    </div>
  );
}
