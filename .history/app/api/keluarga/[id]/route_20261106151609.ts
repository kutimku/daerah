import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

// GET: Detail keluarga + semua anggota
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("keluarga")
    .select(
      `
      id,
      anggota:anggota_keluarga(
        id,
        hubungan,
        jamaah:jamaah_id(id, nama, jenis_kelamin, tanggal_lahir, kelompok:kelompok_id(nama))
      )
    `,
    )
    .eq("id", params.id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

// POST: Tambah anggota ke KK
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const { jamaah_id, hubungan } = await req.json();
  if (!jamaah_id || !hubungan)
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

  const supabase = createServerClient();

  // Cek apakah jamaah sudah ada di keluarga lain
  const { data: existing } = await supabase
    .from("anggota_keluarga")
    .select("id")
    .eq("jamaah_id", jamaah_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Jamaah ini sudah terdaftar dalam keluarga lain" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("anggota_keluarga")
    .insert({ keluarga_id: params.id, jamaah_id, hubungan });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE: Keluarkan anggota dari KK
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const anggotaId = searchParams.get("anggota_id");
  if (!anggotaId)
    return NextResponse.json({ error: "ID anggota wajib" }, { status: 400 });

  const supabase = createServerClient();
  // Jangan izinkan hapus kepala keluarga
  const { data: agg } = await supabase
    .from("anggota_keluarga")
    .select("hubungan")
    .eq("id", anggotaId)
    .single();

  if (agg?.hubungan === "kepala") {
    return NextResponse.json(
      { error: "Kepala keluarga tidak bisa dihapus" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("anggota_keluarga")
    .delete()
    .eq("id", anggotaId);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
