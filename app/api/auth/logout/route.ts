// app/api/auth/logout/route.ts
// Clear session cookie dan redirect ke login

import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.delete(COOKIE_NAME);
  return response;
}
