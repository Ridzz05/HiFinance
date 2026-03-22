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
  "/landing",
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

  // Cek apakah request berasal dari Telegram Mini App
  const isTelegramWebApp =
    req.headers.get("x-telegram-bot-api-secret-token") !== null ||
    req.headers.get("sec-fetch-dest") === "iframe" ||
    req.headers.get("referer")?.includes("t.me");

  // Cek JWT cookie session (browser biasa)
  const session = await getSessionFromRequest(req);
  const isAuthenticated = isTelegramWebApp || session;

  // Handling Root Redirect
  if (pathname === "/") {
    // Auth dihapus sementara, selalu arahkan root ke /dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Izinkan semua path publik
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Izinkan semua akses ke dashboard & transaksi sementara (Testing tanpa auth)
  return NextResponse.next();
  // (support initData dari Telegram ATAU JWT cookie)
  // if (API_PATHS.some((p) => pathname.startsWith(p))) {
  //   return NextResponse.next();
  // }

  // if (isTelegramWebApp) {
  //   return NextResponse.next();
  // }

  // if (session) {
  //   return NextResponse.next();
  // }

  // const loginUrl = new URL("/login", req.url);
  // loginUrl.searchParams.set("redirect", pathname);
  // return NextResponse.redirect(loginUrl);
}

export const config = {
  // Jalankan middleware di semua path kecuali static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
