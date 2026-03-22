// middleware.ts
// Proteksi route — pastikan user terautentikasi sebelum akses dashboard
// Dua mode auth:
//  1. Telegram Mini App: tidak ada cookies tapi initData dikirim via POST body
//     → biarkan lewat, validasi dilakukan di masing-masing API route
//  2. Browser biasa: harus punya cookie hf-session yang valid

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

// Route yang TIDAK perlu auth
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/telegram",
  "/api/auth/logout",
  "/_next",
  "/favicon.ico",
  "/public",
];

// API routes yang bisa skip middleware (validasi dilakukan sendiri)
const API_PATHS = ["/api/"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Izinkan semua path publik
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Untuk API routes — izinkan lewat, tiap route handle validasinya sendiri
  // (support initData dari Telegram ATAU JWT cookie)
  if (API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Cek apakah request berasal dari Telegram Mini App
  // (Telegram akan set header ini di WebView)
  const isTelegramWebApp =
    req.headers.get("x-telegram-bot-api-secret-token") !== null ||
    req.headers.get("sec-fetch-dest") === "iframe" ||
    req.headers.get("referer")?.includes("t.me");

  if (isTelegramWebApp) {
    return NextResponse.next();
  }

  // Cek JWT cookie session (browser biasa)
  const session = await getSessionFromRequest(req);
  if (session) {
    return NextResponse.next();
  }

  // Tidak ada auth → redirect ke login
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Jalankan middleware di semua path kecuali static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
