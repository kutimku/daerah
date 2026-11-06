import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";

// PUT: Edit kegiatan
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const body = await req.json();
  delete body.id; // jangan ubah ID

  const supabase = createServerClient();
  const { error } = await supabase
    .from("kegiatan")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE: Hapus kegiatan
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Tidak login" }, { status: 401 });

  const supabase = createServerClient();
  const { error } = await supabase
    .from("kegiatan")
    .delete()
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
