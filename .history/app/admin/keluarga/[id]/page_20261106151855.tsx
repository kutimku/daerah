import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { formatTanggalPendek } from "@/lib/utils/format";
import { hitungUmur } from "@/lib/utils/umur";
import FormTambahAnggota from "./FormTambahAnggota";

export const dynamic = "force-dynamic";

export default async function DetailKeluargaPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();

  const { data: kk } = await supabase
    .from("keluarga")
    .select(
      `
      id,
      anggota:anggota_keluarga(
        id,
        hubungan,
        jamaah:jamaah_id(id, nama, jenis_kelamin, tanggal_lahir, kelompok:kelompok_id(nama))
      )
    `,
    )
    .eq("id", params.id)
    .single();

  if (!kk) notFound();

  const kepala = kk.anggota?.find((a: any) => a.hubungan === "kepala");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/keluarga"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Kembali ke Daftar Keluarga
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          KK: {kepala?.jamaah?.nama || "Tanpa Nama"}
        </h1>
        <p className="text-sm text-gray-500 font-mono">
          ID KK: {kk.id.slice(0, 8)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tabel Anggota */}
        <div className="md:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-semibold text-gray-800">
              Daftar Anggota Keluarga
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Hubungan</th>
                  <th className="px-4 py-3 text-left">Umur</th>
                  <th className="px-4 py-3 text-left">Kelompok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kk.anggota?.map((a: any) => {
                  const umur = hitungUmur(a.jamaah.tanggal_lahir);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/jamaah/${a.jamaah.id}`}
                          className="font-medium text-primary-600 hover:underline"
                        >
                          {a.jamaah.nama}
                        </Link>
                        <p className="text-xs text-gray-400 font-mono">
                          {a.jamaah.id}
                        </p>
                      </td>
                      <td className="px-4 py-3 capitalize">{a.hubungan}</td>
                      <td className="px-4 py-3">
                        {umur !== null ? `${umur} thn` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {a.jamaah.kelompok?.nama || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Tambah Anggota */}
        <div className="md:col-span-1">
          <FormTambahAnggota keluargaId={kk.id} />
        </div>
      </div>
    </div>
  );
}
