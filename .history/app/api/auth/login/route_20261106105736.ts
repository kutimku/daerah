// ============================================================
// API: Login
// ============================================================
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServerClient } from "@/lib/supabase/server";
import { buatToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id, username, nama, password_hash, role, desa_id, kelompok_id, aktif, wajib_ganti_password",
      )
      .eq("username", username.trim().toLowerCase())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    if (!user.aktif) {
      return NextResponse.json(
        { error: "Akun ini sudah dinonaktifkan" },
        { status: 403 },
      );
    }

    const cocok = await bcrypt.compare(password, user.password_hash);
    if (!cocok) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    // Update last_login_at
    await supabase
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", user.id);

    // Buat token
    const token = await buatToken({
      userId: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
      desa_id: user.desa_id,
      kelompok_id: user.kelompok_id,
      wajib_ganti_password: user.wajib_ganti_password,
    });

    const redirect = user.wajib_ganti_password
      ? "/admin/ganti-password"
      : "/admin";
    const response = NextResponse.json({ ok: true, redirect });
    setSessionCookie(response, token);
    return response;
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
