import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const supabase = createServerClient();

    // 1. Cek koneksi & ambil user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .single();

    if (error) {
      return NextResponse.json({
        status: "ERROR_DATABASE",
        pesan: error.message,
        detail: error,
      });
    }

    if (!user) {
      return NextResponse.json({ status: "USER_TIDAK_DITEMUKAN" });
    }

    // 2. Tes verifikasi password 'admin123'
    const cocok = await bcrypt.compare("admin123", user.password_hash);

    // 3. Cek environment variables
    const envCheck = {
      url_ada: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key_publik_ada: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      key_rahasia_ada: !!process.env.SUPABASE_SECRET_KEY,
    };

    return NextResponse.json({
      status: "SUKSES_KONEKSI",
      user_ditemukan: true,
      username_di_db: user.username,
      password_hash_di_db: user.password_hash.substring(0, 15) + "...",
      tes_password_admin123: cocok ? "COCOK ✅" : "TIDAK COCOK ❌",
      environment: envCheck,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "ERROR_SERVER",
      pesan: err.message,
      stack: err.stack,
    });
  }
}
