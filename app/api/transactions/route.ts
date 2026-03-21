// app/api/transactions/route.ts
// API Route: Daftar transaksi terbaru per user

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { validateInitData } from "@/lib/validate-init-data";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.initData) {
    return NextResponse.json({ error: "initData dibutuhkan" }, { status: 400 });
  }

  const validated = validateInitData(body.initData, process.env.BOT_TOKEN!);
  if (!validated) {
    return NextResponse.json({ error: "initData tidak valid" }, { status: 401 });
  }

  const limit = Math.min(body.limit ?? 20, 50);

  const { data, error } = await getSupabase()
    .from("transactions")
    .select("id, type, amount, category, note, created_at")
    .eq("user_id", validated.user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
