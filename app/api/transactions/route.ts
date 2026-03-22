// app/api/transactions/route.ts
// API Route: Daftar transaksi terbaru per user
// Dual-auth: support Telegram initData (Mini App) + JWT cookie (browser)

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/get-user";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const user = await getUserFromRequest(req, body);
  if (!user) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const limit = Math.min(body.limit ?? 20, 500);

  const { data, error } = await getSupabase()
    .from("transactions")
    .select("id, type, amount, category, note, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// Support GET juga untuk akses browser langsung (dengan cookie)
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 500);

  const { data, error } = await getSupabase()
    .from("transactions")
    .select("id, type, amount, category, note, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

