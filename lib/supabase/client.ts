// ============================================================
// Supabase client untuk BROWSER (frontend)
// Hanya pakai Publishable key — aman jika terlihat publik
// ============================================================
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!url || !key) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL / PUBLISHABLE_KEY belum diisi di .env.local",
  );
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
