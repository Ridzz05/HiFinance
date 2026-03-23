import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Jika browser/user memanggil URL lama (seperti /dashboard yang sekarang menjadi root),
  // segera redirect ke halaman utama aplikasi TMA ("/").
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/landing") ||
    path.startsWith("/login")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi Matcher: membatasi middleware ini agar HANYA dijalankan 
// pada daftar path spesifik ini (sehingga request ke /api atau statis /_next bebas hambatan)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/landing/:path*",
    "/login/:path*",
  ],
};
