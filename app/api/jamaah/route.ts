import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export async function GET(req: Request) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("jamaah")
    .select("*, kelompok:kelompok_id(nama, desa_id, desa:desa_id(nama))")
    .eq("status", "aktif")
    .order("nama");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();
  const body = await req.json();

  // Generate ID via Supabase
  const { data: newId, error: idErr } =
    await supabase.rpc("generate_jamaah_id");
  if (idErr || !newId)
    return NextResponse.json({ error: "Gagal membuat ID" }, { status: 500 });

  const { error } = await supabase.from("jamaah").insert({
    id: newId,
    ...body,
    tanggal_daftar: new Date().toISOString().split("T")[0],
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: newId });
}
