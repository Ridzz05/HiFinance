// lib/get-user.ts
// Helper untuk ekstrak user_id dari request — support 100% TMA
//  1. Telegram Mini App: initData di request body

import { NextRequest } from "next/server";
import { validateInitData } from "@/lib/validate-init-data";

export interface AuthUser {
  id: number;
  first_name: string;
  username?: string;
}

/**
 * Ekstrak user yang terautentikasi dari request.
 * Hanya melalui initData (Telegram Mini App).
 *
 * @returns AuthUser jika terautentikasi, null jika tidak.
 */
export async function getUserFromRequest(
  req: NextRequest,
  body?: Record<string, unknown>
): Promise<AuthUser | null> {
  const initData = body?.initData as string | undefined;
  if (initData) {
    const token = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || "";
    const validated = validateInitData(initData, token);
    if (validated?.user) {
      return {
        id: validated.user.id,
        first_name: validated.user.first_name,
        username: validated.user.username,
      };
    }
  }

  // Khusus mode testing / development lokal (jika tidak ada info Telegram)
  if (process.env.NODE_ENV === "development" && !initData) {
     return {
        id: 123456789,
        first_name: "Dev User",
        username: "devuser",
     };
  }

  return null;
}
