import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

// POST: Aksi admin (Setujui / Tolak / Perbaikan)
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const { aksi, catatan } = await req.json();
  const supabase = createServerClient();

  // 1. Ambil data pendaftaran
  const { data: pendaftaran, error: getErr } = await supabase
    .from("pendaftaran")
    .select("*")
    .eq("id", params.id)
    .single();

  if (getErr || !pendaftaran)
    return NextResponse.json(
      { error: "Data tidak ditemukan" },
      { status: 404 },
    );

  // ==========================================
  // AKSI: SETUJUI
  // ==========================================
  if (aksi === "setuju") {
    const data = pendaftaran.data_json;
    const kepala = data.kepala;
    const anggotaList = data.anggota || [];

    // Generate ID Kepala
    const { data: idKepala, error: errId1 } =
      await supabase.rpc("generate_jamaah_id");
    if (errId1)
      return NextResponse.json({ error: "Gagal generate ID" }, { status: 500 });

    // Insert Kepala Keluarga ke tabel jamaah
    const { error: errInsert1 } = await supabase.from("jamaah").insert({
      id: idKepala,
      nama: kepala.nama,
      jenis_kelamin: kepala.jenis_kelamin,
      tempat_lahir: kepala.tempat_lahir || null,
      tanggal_lahir: kepala.tanggal_lahir || null,
      no_hp: kepala.no_hp || null,
      kelompok_id: kepala.kelompok_id,
      status_pernikahan: "menikah", // Asumsi KK sudah menikah
      tanggal_daftar: new Date().toISOString().split("T")[0],
    });
    if (errInsert1)
      return NextResponse.json({ error: errInsert1.message }, { status: 500 });

    // Insert Keluarga
    const { data: kk, error: errKK } = await supabase
      .from("keluarga")
      .insert({ kepala_jamaah_id: idKepala })
      .select()
      .single();
    if (errKK)
      return NextResponse.json({ error: errKK.message }, { status: 500 });

    // Daftarkan Kepala di Anggota Keluarga
    await supabase.from("anggota_keluarga").insert({
      keluarga_id: kk.id,
      jamaah_id: idKepala,
      hubungan: "kepala",
    });

    // Loop Anggota Keluarga (Istri/Anak)
    for (const agg of anggotaList) {
      if (!agg.nama) continue; // skip yang kosong
      const { data: idAgg } = await supabase.rpc("generate_jamaah_id");

      const { error: errInsertAgg } = await supabase.from("jamaah").insert({
        id: idAgg,
        nama: agg.nama,
        jenis_kelamin: agg.jenis_kelamin,
        tempat_lahir: agg.tempat_lahir || null,
        tanggal_lahir: agg.tanggal_lahir || null,
        kelompok_id: kepala.kelompok_id, // default ikut KK
        tanggal_daftar: new Date().toISOString().split("T")[0],
      });

      if (!errInsertAgg) {
        await supabase.from("anggota_keluarga").insert({
          keluarga_id: kk.id,
          jamaah_id: idAgg,
          hubungan: agg.hubungan,
        });
      }
    }

    // Update status pendaftaran
    await supabase
      .from("pendaftaran")
      .update({ status: "disetujui", catatan_admin: null })
      .eq("id", params.id);
    return NextResponse.json({ ok: true });
  }

  // ==========================================
  // AKSI: TOLAK / PERBAIKAN
  // ==========================================
  if (aksi === "tolak" || aksi === "perbaikan") {
    if (!catatan)
      return NextResponse.json(
        { error: "Catatan wajib diisi" },
        { status: 400 },
      );

    const newStatus = aksi === "tolak" ? "ditolak" : "perbaikan";
    const token = aksi === "perbaikan" ? crypto.randomUUID() : null;

    await supabase
      .from("pendaftaran")
      .update({
        status: newStatus,
        catatan_admin: catatan,
        token_perbaikan: token,
      })
      .eq("id", params.id);

    return NextResponse.json({ ok: true, token });
  }

  return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
}
