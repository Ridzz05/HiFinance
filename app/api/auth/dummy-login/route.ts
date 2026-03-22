// app/api/auth/dummy-login/route.ts
// Dummy auth untuk sementara — menerima kredensial apapun dan set session cookie
// TODO: Ganti dengan validasi real saat sistem auth production siap

import { NextRequest, NextResponse } from "next/server";
import { signSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { username, email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
  }

  // Dummy: buat session dari data yang diisi (tanpa validasi real)
  // Gunakan email sebagai "telegram_id" dummy (pakai hash sederhana)
  const dummyId = Math.abs(
    Array.from(email as string).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  ) || 99999;

  const token = await signSession({
    telegram_id: dummyId,
    first_name: (username as string) || (email as string).split("@")[0],
    username: (username as string) || undefined,
    plan: "free",
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });

  return response;
}
