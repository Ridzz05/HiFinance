// lib/supabase.ts
// Supabase client singleton untuk server-side (API routes)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Gunakan service_role key di server — JANGAN expose ke client
export const supabase = createClient(supabaseUrl, supabaseKey);
