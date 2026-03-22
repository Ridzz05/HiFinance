// lib/auth.ts
// JWT session management untuk HiFinance web auth
// Menggunakan `jose` (Web Crypto compatible, works di Next.js Edge Runtime)

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "hf-session";
const JWT_EXPIRY = "7d";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET tidak ada di environment");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  telegram_id: number;
  first_name: string;
  username?: string;
  plan: "free" | "pro";
}

/**
 * Buat JWT token dari payload session user.
 */
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret());
}

/**
 * Verifikasi dan decode JWT token.
 * Returns null jika token tidak valid atau expired.
 */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Ambil session dari cookie (untuk Server Components & API routes).
 * Returns null jika tidak ada session atau expired.
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Ambil session dari request (untuk middleware & API routes).
 * Returns null jika tidak ada session atau expired.
 */
export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Nama cookie yang digunakan untuk menyimpan session. */
export { COOKIE_NAME };
