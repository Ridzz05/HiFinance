// lib/supabase.ts
// Supabase client lazy getter untuk server-side (API routes)

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

// Lazy initialization — hanya dibuat saat runtime, bukan saat build
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum di-set");
    _supabase = createClient(url, key);
  }
  return _supabase;
}
