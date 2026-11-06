// ============================================================
// Supabase client untuk SERVER (backend API route)
// Pakai Secret key — JANGAN diimport di file yang ada 'use client'
// ============================================================
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SECRET_KEY!;

  if (!url || !key) {
    throw new Error("SUPABASE_URL / SECRET_KEY belum diisi di .env.local");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
