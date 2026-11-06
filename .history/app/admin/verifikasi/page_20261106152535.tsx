import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import VerifikasiList from "@/components/VerifikasiList";

export const dynamic = "force-dynamic";

export default async function VerifikasiPage() {
  const user = await getUser();
  const supabase = createServerClient();

  let query = supabase
    .from("pendaftaran")
    .select("*")
    .order("created_at", { ascending: false });

  if (user?.role === "kelompok" && user.kelompok_id) {
    query = query.eq("kelompok_id", user.kelompok_id);
  } else if (user?.role === "desa" && user.desa_id) {
    const { data: kel } = await supabase
      .from("kelompok")
      .select("id")
      .eq("desa_id", user.desa_id);
    const ids = kel?.map((k) => k.id) || [];
    query = query.in("kelompok_id", ids);
  }

  const { data: list } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Antrean Verifikasi</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pendaftaran mandiri dari jamaah yang menunggu persetujuan.
        </p>
      </div>
      <VerifikasiList data={list || []} />
    </div>
  );
}
