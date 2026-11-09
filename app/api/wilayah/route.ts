import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: desa, error: errDesa } = await supabase
      .from("desa")
      .select("id, nama")
      .order("urutan");

    const { data: kelompok, error: errKelompok } = await supabase
      .from("kelompok")
      .select("id, nama, desa_id")
      .order("nama");

    if (errDesa || errKelompok) {
      return NextResponse.json(
        { error: "Gagal mengambil data wilayah" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      desa: desa || [],
      kelompok: kelompok || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
