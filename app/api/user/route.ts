import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateInitData } from "@/lib/validate-init-data";

export async function POST(req: Request) {
  try {
    const { initData } = await req.json();
    if (!initData) return NextResponse.json({ error: "No initData provided" }, { status: 400 });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });

    const validData = validateInitData(initData, token);
    if (!validData) return NextResponse.json({ error: "Invalid Telegram Data Hash" }, { status: 401 });

    const telegramId = validData.user.id;
    const supabase = getSupabase();
    
    // Fetch tier from `users` table
    const { data, error } = await supabase
      .from("users")
      .select("tier")
      .eq("telegram_id", telegramId)
      .single();

    // If no data exists yet, they are implicitly a free user
    if (error || !data) {
       return NextResponse.json({ telegramId, tier: "free" });
    }

    return NextResponse.json({ telegramId, tier: data.tier || "free" });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
