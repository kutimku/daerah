import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET: Cari jamaah berdasarkan nama/kelompok untuk halaman scan
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const supabase = createServerClient();
  let query = supabase
    .from("jamaah")
    .select("id, nama, kelompok:kelompok_id(nama)")
    .eq("status", "aktif");

  if (q) query = query.ilike("nama", `%${q}%`);

  const { data } = await query.limit(20);
  return NextResponse.json({ data });
}

// POST: Catat kehadiran dari QR
export async function POST(req: Request) {
  const { kegiatan_id, jamaah_id } = await req.json();
  if (!kegiatan_id || !jamaah_id)
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

  const supabase = createServerClient();

  // Cek apakah sudah pernah absen
  const { data: existing } = await supabase
    .from("absensi")
    .select("id")
    .eq("kegiatan_id", kegiatan_id)
    .eq("jamaah_id", jamaah_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Anda sudah tercatat hadir di kegiatan ini" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("absensi").insert({
    kegiatan_id,
    jamaah_id,
    status: "hadir",
    waktu_hadir: new Date().toISOString(),
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
