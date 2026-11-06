import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("jamaah")
    .select("*, kelompok:kelompok_id(nama, desa_id, desa:desa_id(nama))")
    .eq("id", params.id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();
  const body = await req.json();

  // Jangan kirim id di body
  delete body.id;

  const { error } = await supabase
    .from("jamaah")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  // Hanya Admin Daerah yang boleh hapus
  if (user.role !== "daerah") {
    return NextResponse.json(
      { error: "Hanya Admin Daerah yang bisa menghapus" },
      { status: 403 },
    );
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("jamaah").delete().eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
