import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16: file must be named `proxy.ts` and export a function named `proxy`
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Redirect legacy URLs from the old routing structure to the new root
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/landing") ||
    path.startsWith("/login")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/landing/:path*",
    "/login/:path*",
  ],
};
