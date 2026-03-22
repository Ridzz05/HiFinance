// lib/get-user.ts
// Helper untuk ekstrak user_id dari request — support dual-auth:
//  1. Telegram Mini App: initData di request body
//  2. Browser: hf-session JWT cookie

import { NextRequest } from "next/server";
import { validateInitData } from "@/lib/validate-init-data";
import { getSessionFromRequest } from "@/lib/auth";

export interface AuthUser {
  id: number;
  first_name: string;
  username?: string;
}

/**
 * Ekstrak user yang terautentikasi dari request.
 * Coba initData (Telegram Mini App) dulu, lalu JWT cookie (browser).
 *
 * @returns AuthUser jika terautentikasi, null jika tidak.
 */
export async function getUserFromRequest(
  req: NextRequest,
  body?: Record<string, unknown>
): Promise<AuthUser | null> {
  // Mode 1: Telegram Mini App — initData di request body
  const initData = body?.initData as string | undefined;
  if (initData) {
    const validated = validateInitData(initData, process.env.BOT_TOKEN!);
    if (validated?.user) {
      return {
        id: validated.user.id,
        first_name: validated.user.first_name,
        username: validated.user.username,
      };
    }
  }

  // Mode 2: Browser — JWT cookie session
  const session = await getSessionFromRequest(req);
  if (session) {
    return {
      id: session.telegram_id,
      first_name: session.first_name,
      username: session.username,
    };
  }

  return null;
}
