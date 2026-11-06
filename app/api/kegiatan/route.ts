import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

// GET: Ambil semua kegiatan (admin)
export async function GET() {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("kegiatan")
    .select("*, desa:desa_id(nama), kelompok:kelompok_id(nama)")
    .order("tanggal", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST: Tambah kegiatan baru
export async function POST(req: Request) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerClient();

  // Generate ID kegiatan (G001, G002, ...)
  const { data: newId, error: idErr } = await supabase.rpc(
    "generate_kegiatan_id",
  );
  if (idErr)
    return NextResponse.json(
      { error: "Gagal membuat ID kegiatan" },
      { status: 500 },
    );

  const { error } = await supabase.from("kegiatan").insert({
    id: newId,
    ...body,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: newId });
}
