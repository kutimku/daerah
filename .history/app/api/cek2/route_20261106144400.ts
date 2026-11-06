import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const supabase = createServerClient();

    // 1. Buat hash baru yang PASTI cocok untuk 'admin123'
    const hashBaru = await bcrypt.hash("admin123", 10);

    // 2. Timpa hash di database
    const { error } = await supabase
      .from("users")
      .update({
        password_hash: hashBaru,
        wajib_ganti_password: true,
      })
      .eq("username", "admin");

    if (error) {
      return NextResponse.json({ status: "GAGAL_UPDATE", error });
    }

    return NextResponse.json({
      status: "SUKSES_GANTI_PASSWORD",
      pesan:
        "Password admin BERHASIL diubah menjadi admin123. Silakan coba login lagi!",
      hash_baru: hashBaru,
    });
  } catch (err: any) {
    return NextResponse.json({ error_server: err.message });
  }
}
