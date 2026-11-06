import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

// GET: Daftar semua keluarga
export async function GET() {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("keluarga")
    .select(
      `
      id, 
      created_at,
      kepala:anggota_keluarga!inner(
        hubungan, 
        jamaah:jamaah_id(id, nama, kelompok:kelompok_id(nama))
      )
    `,
    )
    .eq("anggota_keluarga.hubungan", "kepala")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST: Buat KK baru + langsung tambahkan kepala keluarga
export async function POST(req: Request) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const { kepala_jamaah_id } = await req.json();
  if (!kepala_jamaah_id)
    return NextResponse.json(
      { error: "Pilih kepala keluarga" },
      { status: 400 },
    );

  const supabase = createServerClient();

  // 1. Cek apakah jamaah ini sudah punya keluarga
  const { data: existing } = await supabase
    .from("anggota_keluarga")
    .select("id")
    .eq("jamaah_id", kepala_jamaah_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Jamaah ini sudah terdaftar dalam keluarga lain" },
      { status: 400 },
    );
  }

  // 2. Buat KK baru
  const { data: kk, error: kkErr } = await supabase
    .from("keluarga")
    .insert({ kepala_jamaah_id })
    .select()
    .single();

  if (kkErr)
    return NextResponse.json({ error: kkErr.message }, { status: 500 });

  // 3. Daftarkan kepala keluarga di tabel anggota
  const { error: aggErr } = await supabase.from("anggota_keluarga").insert({
    keluarga_id: kk.id,
    jamaah_id: kepala_jamaah_id,
    hubungan: "kepala",
  });

  if (aggErr)
    return NextResponse.json({ error: aggErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: kk.id });
}
