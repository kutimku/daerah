import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import FormJamaah from "@/components/FormJamaah";

export default async function EditJamaahPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const [{ data: jamaah }, { data: kelompok }, { data: desa }] =
    await Promise.all([
      supabase.from("jamaah").select("*").eq("id", params.id).single(),
      supabase.from("kelompok").select("*").order("nama"),
      supabase.from("desa").select("*").order("urutan"),
    ]);

  if (!jamaah) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/jamaah/${params.id}`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Kembali ke Detail
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          Edit Data Jamaah
        </h1>
        <p className="text-sm text-gray-500 font-mono">ID: {jamaah.id}</p>
      </div>
      <FormJamaah
        initialData={jamaah}
        kelompokList={kelompok || []}
        desaList={desa || []}
        isEdit={true}
      />
    </div>
  );
}
