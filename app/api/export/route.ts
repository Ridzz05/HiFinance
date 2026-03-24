// app/api/export/route.ts
// Server-side Excel export
// - Browser (JWT cookie): return file .xlsx langsung sebagai download
// - Telegram Mini App (initData): kirim file ke chat Telegram user via Bot API

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/get-user";
import { getSupabase } from "@/lib/supabase";

const MONTH_NAMES = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function fmtIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(n);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const user = await getUserFromRequest(req, body);
  if (!user) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const userId = user.id;
  
  // ── Proteksi Premium (Hanya Guardian & Founder) ──
  const { data: userData } = await getSupabase()
    .from("users")
    .select("tier")
    .eq("telegram_id", userId)
    .single();

  const tier = userData?.tier || "free";
  if (tier === "free") {
    return NextResponse.json({ error: "Fitur Ekspor Pekerjaan eksklusif untuk Guardian/Founder." }, { status: 403 });
  }

  const firstName = user.first_name ?? "User";
  const isTelegram = !!body?.initData; // Tentukan jalur output

  // Ambil semua transaksi user (max 1000)
  const { data: transactions, error: txError } = await getSupabase()
    .from("transactions")
    .select("id, type, amount, category, note, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 });
  }

  const rows = transactions ?? [];

  // Generate XLSX
  const XLSX = await import("xlsx");

  // Sheet 1: Semua Transaksi
  const txRows = rows.map(tx => ({
    Tanggal: new Date(tx.created_at).toLocaleDateString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    } as Intl.DateTimeFormatOptions),
    Jenis: tx.type === "income" ? "Pemasukan" : "Pengeluaran",
    Kategori: tx.category,
    Nominal: tx.amount,
    "Nominal (IDR)": fmtIDR(tx.amount),
    Catatan: tx.note || "-",
  }));

  const ws1 = XLSX.utils.json_to_sheet(txRows.length > 0 ? txRows : [{ Info: "Belum ada transaksi" }]);
  ws1["!cols"] = [{ wch: 26 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 30 }];

  // Sheet 2: Ringkasan bulan berjalan
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const monthlyRows = rows.filter(t => t.created_at >= startDate && t.created_at < endDate);
  const totalIncome = monthlyRows.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthlyRows.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const catMap: Record<string, number> = {};
  monthlyRows.filter(t => t.type === "expense").forEach(t => {
    catMap[t.category] = (catMap[t.category] ?? 0) + t.amount;
  });

  const catRows = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => ({
      Kategori: cat,
      "Total (IDR)": fmtIDR(amt),
      Persentase: totalExpense > 0 ? `${Math.round((amt / totalExpense) * 100)}%` : "0%",
    }));

  const ws2 = XLSX.utils.json_to_sheet([
    { Keterangan: "Nama",              Nilai: firstName },
    { Keterangan: "Periode",           Nilai: `${MONTH_NAMES[month]} ${year}` },
    { Keterangan: "Total Pemasukan",   Nilai: fmtIDR(totalIncome) },
    { Keterangan: "Total Pengeluaran", Nilai: fmtIDR(totalExpense) },
    { Keterangan: "Saldo",             Nilai: fmtIDR(totalIncome - totalExpense) },
    { Keterangan: "", Nilai: "" },
    { Keterangan: "─── Kategori Pengeluaran ───", Nilai: "" },
    ...catRows.map(c => ({ Keterangan: c.Kategori, Nilai: c["Total (IDR)"], Persentase: c.Persentase })),
  ]);
  ws2["!cols"] = [{ wch: 28 }, { wch: 20 }, { wch: 12 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "Transaksi");
  XLSX.utils.book_append_sheet(wb, ws2, "Ringkasan");

  const dateStr = now.toISOString().split("T")[0];
  const fileName = `HiFinance_${firstName}_${dateStr}.xlsx`;
  const xlsxBuffer: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  // ── Jalur 1: Browser → return file sebagai direct download ──
  if (!isTelegram) {
    return new NextResponse(new Uint8Array(xlsxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(xlsxBuffer.length),
      },
    });
  }

  // ── Jalur 2: Telegram Mini App → kirim file ke chat user via Bot API ──
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
  if (!botToken) throw new Error("Bot token tidak ditemukan");
  const formData = new FormData();
  formData.append("chat_id", String(userId));
  formData.append(
    "caption",
    `📊 *Ekspor Data HiFinance*\nHalo ${firstName}! Berikut data keuanganmu.\n\n` +
    `📅 Diekspor: ${now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}\n` +
    `📝 Total transaksi: ${rows.length}\n\n_File berisi 2 sheet: Transaksi & Ringkasan._`
  );
  formData.append("parse_mode", "Markdown");
  formData.append(
    "document",
    new Blob([new Uint8Array(xlsxBuffer)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );

  const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
    method: "POST",
    body: formData,
  });

  if (!tgRes.ok) {
    const err = await tgRes.json();
    console.error("sendDocument error:", err);
    return NextResponse.json({ error: "Gagal mengirim file ke Telegram" }, { status: 500 });
  }

  return NextResponse.json({ success: true, fileName, totalRows: rows.length });
}
