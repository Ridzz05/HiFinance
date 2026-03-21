// lib/validate-init-data.ts
// Port TypeScript dari utils/webapp_validator.py
// Validasi Telegram initData menggunakan HMAC-SHA256

import { createHmac } from "crypto";

const MAX_AGE_SECONDS = 3600; // 1 jam

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface ValidatedInitData {
  user: TelegramUser;
  auth_date: number;
  hash: string;
  [key: string]: unknown;
}

/**
 * Memvalidasi initData dari Telegram Mini App menggunakan HMAC-SHA256.
 * Sesuai dokumentasi resmi: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * @param initDataRaw - String URL-encoded dari Telegram
 * @param botToken - TELEGRAM_BOT_TOKEN dari environment
 * @returns ValidatedInitData jika valid, null jika tidak valid/expired
 */
export function validateInitData(
  initDataRaw: string,
  botToken: string
): ValidatedInitData | null {
  try {
    const params = new URLSearchParams(initDataRaw);
    const receivedHash = params.get("hash");
    if (!receivedHash) return null;

    params.delete("hash");

    // Cek expiry
    const authDate = parseInt(params.get("auth_date") ?? "0", 10);
    const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
    if (ageSeconds > MAX_AGE_SECONDS) return null;

    // Sort dan buat data-check-string
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    // secret_key = HMAC-SHA256("WebAppData", bot_token)
    const secretKey = createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    // expected_hash = HMAC-SHA256(data_check_string, secret_key)
    const expectedHash = createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (expectedHash !== receivedHash) return null;

    const userStr = params.get("user");
    const user: TelegramUser = userStr ? JSON.parse(userStr) : null;
    if (!user) return null;

    return {
      user,
      auth_date: authDate,
      hash: receivedHash,
    };
  } catch {
    return null;
  }
}
