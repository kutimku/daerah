// ============================================================
// API: Ganti password (untuk login pertama atau ganti biasa)
// ============================================================
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { buatToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    const { passwordLama, passwordBaru } = await req.json();

    if (!passwordBaru || passwordBaru.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    const { data: dbUser } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", user.userId)
      .single();

    if (!dbUser) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Kalau bukan login pertama, wajib verifikasi password lama
    if (!user.wajib_ganti_password) {
      if (!passwordLama) {
        return NextResponse.json(
          { error: "Password lama wajib diisi" },
          { status: 400 },
        );
      }
      const cocok = await bcrypt.compare(passwordLama, dbUser.password_hash);
      if (!cocok) {
        return NextResponse.json(
          { error: "Password lama salah" },
          { status: 401 },
        );
      }
    }

    const hash = await bcrypt.hash(passwordBaru, 10);
    const { error: updErr } = await supabase
      .from("users")
      .update({ password_hash: hash, wajib_ganti_password: false })
      .eq("id", user.userId);

    if (updErr) {
      return NextResponse.json(
        { error: "Gagal menyimpan password baru" },
        { status: 500 },
      );
    }

    // Buat token baru (flag wajib ganti sudah false)
    const token = await buatToken({
      ...user,
      wajib_ganti_password: false,
    });

    const response = NextResponse.json({ ok: true, redirect: "/admin" });
    setSessionCookie(response, token);
    return response;
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
