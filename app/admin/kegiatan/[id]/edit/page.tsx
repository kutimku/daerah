import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import FormKegiatan from "@/components/FormKegiatan";

export default async function EditKegiatanPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const [{ data: kegiatan }, { data: desa }, { data: kelompok }] =
    await Promise.all([
      supabase.from("kegiatan").select("*").eq("id", params.id).single(),
      supabase.from("desa").select("*").order("urutan"),
      supabase.from("kelompok").select("*").order("nama"),
    ]);

  if (!kegiatan) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/kegiatan"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Edit Kegiatan</h1>
        <p className="text-sm text-gray-500 font-mono">ID: {kegiatan.id}</p>
      </div>
      <FormKegiatan
        initialData={kegiatan}
        desaList={desa || []}
        kelompokList={kelompok || []}
        isEdit={true}
      />
    </div>
  );
}
