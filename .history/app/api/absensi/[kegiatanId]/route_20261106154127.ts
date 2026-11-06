import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

// GET: Ambil data absensi kegiatan ini + semua jamaah aktif
export async function GET(
  req: Request,
  { params }: { params: { kegiatanId: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();

  // 1. Ambil data kegiatan
  const { data: kegiatan } = await supabase
    .from("kegiatan")
    .select("*")
    .eq("id", params.kegiatanId)
    .single();
  if (!kegiatan)
    return NextResponse.json(
      { error: "Kegiatan tidak ditemukan" },
      { status: 404 },
    );

  // 2. Ambil semua jamaah aktif (bisa difilter berdasarkan tingkat kegiatan jika perlu)
  const { data: jamaahList } = await supabase
    .from("jamaah")
    .select("id, nama, kelompok_id, kelompok:kelompok_id(nama)")
    .eq("status", "aktif")
    .order("nama");

  // 3. Ambil data absensi yang sudah ada
  const { data: absensiList } = await supabase
    .from("absensi")
    .select("*")
    .eq("kegiatan_id", params.kegiatanId);

  return NextResponse.json({ kegiatan, jamaahList, absensiList });
}

// POST: Simpan absensi manual (bulk update)
export async function POST(
  req: Request,
  { params }: { params: { kegiatanId: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const { data: absensiArray } = await req.json(); // Array of { jamaah_id, status }
  const supabase = createServerClient();

  // Hapus absensi lama untuk kegiatan ini (biar bersih saat disimpan ulang)
  await supabase.from("absensi").delete().eq("kegiatan_id", params.kegiatanId);

  // Siapkan data baru
  const insertData = absensiArray
    .filter((a: any) => a.status !== "belum") // Hanya simpan yang ada statusnya
    .map((a: any) => ({
      kegiatan_id: params.kegiatanId,
      jamaah_id: a.jamaah_id,
      status: a.status,
      waktu_hadir: a.status === "hadir" ? new Date().toISOString() : null,
    }));

  if (insertData.length > 0) {
    const { error } = await supabase.from("absensi").insert(insertData);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
