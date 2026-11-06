import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

// GET: Ambil antrean pendaftaran (khusus admin)
export async function GET() {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();

  // Filter berdasarkan role
  let query = supabase
    .from("pendaftaran")
    .select("*")
    .order("created_at", { ascending: false });

  if (user.role === "kelompok" && user.kelompok_id) {
    query = query.eq("kelompok_id", user.kelompok_id);
  } else if (user.role === "desa" && user.desa_id) {
    const { data: kel } = await supabase
      .from("kelompok")
      .select("id")
      .eq("desa_id", user.desa_id);
    const ids = kel?.map((k) => k.id) || [];
    query = query.in("kelompok_id", ids);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST: Kirim pendaftaran baru (dari form publik, TANPA LOGIN)
export async function POST(req: Request) {
  const supabase = createServerClient();
  const body = await req.json();

  // Validasi minimal
  if (!body.kepala?.nama || !body.kepala?.kelompok_id) {
    return NextResponse.json(
      { error: "Nama dan kelompok kepala keluarga wajib diisi" },
      { status: 400 },
    );
  }

  // Simpan ke antrean (status: menunggu)
  const { error } = await supabase.from("pendaftaran").insert({
    data_json: body,
    status: "menunggu",
    kelompok_id: body.kepala.kelompok_id,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
