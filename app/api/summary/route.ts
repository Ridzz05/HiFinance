// app/api/summary/route.ts
// API Route: Ringkasan keuangan bulanan per user
// Diproteksi dengan validasi Telegram initData

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { validateInitData } from "@/lib/validate-init-data";
import { getSupabase } from "@/lib/supabase";
import { CategorySummary, MonthlySummary } from "@/lib/types";

const MONTH_NAMES = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.initData) {
    return NextResponse.json({ error: "initData dibutuhkan" }, { status: 400 });
  }

  // Validasi identitas user
  const validated = validateInitData(body.initData, process.env.BOT_TOKEN!);
  if (!validated) {
    return NextResponse.json({ error: "initData tidak valid" }, { status: 401 });
  }

  const telegramId = validated.user.id;
  const now = new Date();
  const year: number = body.year ?? now.getFullYear();
  const month: number = body.month ?? now.getMonth() + 1;

  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const { data: transactions, error } = await getSupabase()
    .from("transactions")
    .select("type, amount, category, note, created_at")
    .eq("user_id", telegramId)
    .gte("created_at", startDate)
    .lt("created_at", endDate)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type TxRow = { type: string; amount: number; category: string; note: string; created_at: string };
  const rows: TxRow[] = transactions ?? [];
  const totalIncome = rows.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = rows.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const categoryMap: Record<string, number> = {};
  rows.filter(t => t.type === "expense").forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] ?? 0) + t.amount;
  });

  const expenseByCategory: CategorySummary[] = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 1000) / 10 : 0,
    }));

  const summary: MonthlySummary = {
    period: { year, month, label: `${MONTH_NAMES[month]} ${year}` },
    total_income: totalIncome,
    total_expense: totalExpense,
    balance: totalIncome - totalExpense,
    expense_by_category: expenseByCategory,
    transaction_count: rows.length,
  };

  return NextResponse.json(summary);
}
