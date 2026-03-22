// app/api/auth/dummy-login/route.ts
// Dummy auth untuk sementara — menerima kredensial apapun dan set session cookie
// Multi-user: setiap email mendapat ID unik yang konsisten (SHA-256 digest)
// TODO: Ganti dengan validasi database real saat sistem auth production siap

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { signSession, COOKIE_NAME } from "@/lib/auth";

/**
 * Buat numeric user_id yang konsisten dari email.
 * Menggunakan 8 karakter pertama SHA-256 → dikonversi ke integer.
 * Email yang sama = ID yang sama = data yang sama di Supabase.
 */
function emailToUserId(email: string): number {
  const hash = createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
  // Ambil 8 hex karakter pertama → max ~4 miliar, cukup untuk dummy
  return parseInt(hash.substring(0, 8), 16);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { username, email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
  }

  if ((password as string).length < 4) {
    return NextResponse.json({ error: "Password minimal 4 karakter" }, { status: 400 });
  }

  // Buat user_id yang konsisten dan unik per email
  const userId = emailToUserId(email as string);
  const displayName = (username as string)?.trim() || (email as string).split("@")[0];

  const token = await signSession({
    telegram_id: userId,
    first_name: displayName,
    username: (username as string)?.trim() || undefined,
    plan: "free",
  });

  const response = NextResponse.json({
    success: true,
    user: { id: userId, name: displayName },
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });

  return response;
}
