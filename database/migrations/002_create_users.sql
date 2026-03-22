-- ============================================================
-- Supabase SQL Migration 002: Users & Subscriptions
-- Jalankan di Supabase Dashboard -> SQL Editor
-- ============================================================

-- Tabel untuk menyimpan profil user yang login via Telegram
CREATE TABLE IF NOT EXISTS public.users (
  telegram_id   BIGINT PRIMARY KEY,
  first_name    TEXT NOT NULL,
  last_name     TEXT,
  username      TEXT,
  photo_url     TEXT,
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  plan_expires  TIMESTAMPTZ,                       -- NULL = free forever / tidak aktif
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk lookup cepat
CREATE INDEX IF NOT EXISTS idx_users_username
  ON public.users (username)
  WHERE username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_plan
  ON public.users (plan);
