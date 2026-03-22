// app/api/auth/telegram/route.ts
// Menerima callback dari Telegram Login Widget dan membuat session JWT

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getSupabase } from "@/lib/supabase";
import { signSession, COOKIE_NAME } from "@/lib/auth";

interface TelegramAuthData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
}

/**
 * Verifikasi data dari Telegram Login Widget.
 * Berbeda dengan initData — ini untuk OAuth web login.
 * Ref: https://core.telegram.org/widgets/login#checking-authorization
 */
function verifyTelegramAuth(data: TelegramAuthData, botToken: string): boolean {
  const { hash, ...rest } = data;

  // Buat data check string (sorted keys, tanpa hash)
  const dataCheckString = Object.entries(rest)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  // secret_key = SHA256(bot_token) — BERBEDA dari initData!
  const secretKey = createHmac("sha256", "").update(botToken).digest();
  // Note: Telegram docs: secret key = SHA256(bot_token), bukan HMAC
  const { createHash } = require("crypto");
  const realSecret = createHash("sha256").update(botToken).digest();

  const expectedHash = createHmac("sha256", realSecret)
    .update(dataCheckString)
    .digest("hex");

  // Cek expiry (max 1 jam)
  const authDate = parseInt(rest.auth_date, 10);
  const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
  if (ageSeconds > 3600) return false;

  return expectedHash === hash;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Ekstrak semua params dan pastikan field wajib ada
  const rawParams = Object.fromEntries(url.searchParams.entries());
  const { hash, id, first_name, auth_date, last_name, username, photo_url } = rawParams;

  if (!hash || !id || !auth_date || !first_name) {
    return NextResponse.redirect(new URL("/login?error=missing_params", req.url));
  }

  const params: TelegramAuthData = {
    id,
    first_name,
    last_name,
    username,
    photo_url,
    auth_date,
    hash,
  };

  const botToken = process.env.BOT_TOKEN!;
  if (!verifyTelegramAuth(params, botToken)) {
    return NextResponse.redirect(new URL("/login?error=invalid_auth", req.url));
  }

  const telegramId = parseInt(params.id, 10);
  const firstName = params.first_name;

  // Upsert user ke Supabase
  const { error } = await getSupabase()
    .from("users")
    .upsert(
      {
        telegram_id: telegramId,
        first_name: firstName,
        last_name: params.last_name ?? null,
        username: params.username ?? null,
        photo_url: params.photo_url ?? null,
        last_login: new Date().toISOString(),
      },
      { onConflict: "telegram_id" }
    );

  if (error) {
    console.error("Gagal upsert user:", error);
    return NextResponse.redirect(new URL("/login?error=db_error", req.url));
  }

  // Ambil plan user
  const { data: userData } = await getSupabase()
    .from("users")
    .select("plan")
    .eq("telegram_id", telegramId)
    .single();

  const plan = (userData?.plan ?? "free") as "free" | "pro";

  // Buat JWT session
  const token = await signSession({
    telegram_id: telegramId,
    first_name: firstName,
    username: params.username,
    plan,
  });

  // Set cookie & redirect ke dashboard
  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });

  return response;
}
