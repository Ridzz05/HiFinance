// app/api/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/get-user";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req, {});
  if (!user) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { data, error } = await getSupabase()
    .from("user_settings")
    .select("budget_limit")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") { // Ignore 'no rows found'
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ budget_limit: data?.budget_limit || 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const user = await getUserFromRequest(req, body);
  if (!user) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const db = getSupabase();

  // ── Proteksi Premium (Hanya Guardian & Founder) ──
  const { data: userData } = await db
    .from("users")
    .select("tier")
    .eq("telegram_id", user.id)
    .single();

  const tier = userData?.tier || "free";
  if (tier === "free") {
    return NextResponse.json({ error: "Pengaturan Wallet Guardian eksklusif untuk tier Guardian/Founder." }, { status: 403 });
  }

  const budget_limit = Number(body.budget_limit);
  if (isNaN(budget_limit) || budget_limit < 0) {
    return NextResponse.json({ error: "Budget tidak valid" }, { status: 400 });
  }

  
  // Upsert settings (requires RLS policy permitting INSERT/UPDATE)
  const { error } = await db
    .from("user_settings")
    .upsert(
      { user_id: user.id, budget_limit, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, budget_limit });
}
