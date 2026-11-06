import { createServerClient } from "@/lib/supabase/server";
import FormJamaah from "@/components/FormJamaah";

export default async function TambahJamaahPage() {
  const supabase = createServerClient();
  const [{ data: kelompok }, { data: desa }] = await Promise.all([
    supabase.from("kelompok").select("*").order("nama"),
    supabase.from("desa").select("*").order("urutan"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Jamaah</h1>
        <p className="text-gray-500 text-sm mt-1">
          Isi data dengan lengkap. ID akan dibuat otomatis.
        </p>
      </div>
      <FormJamaah kelompokList={kelompok || []} desaList={desa || []} />
    </div>
  );
}
