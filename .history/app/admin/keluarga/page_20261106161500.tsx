import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function KeluargaPage() {
  const supabase = createServerClient();

  // Ambil semua KK beserta jumlah anggotanya
  const { data: keluarga } = await supabase
    .from("keluarga")
    .select(
      `
      id, 
      created_at,
      anggota:anggota_keluarga(
        hubungan,
        jamaah:jamaah_id(nama, id)
      )
    `,
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Keluarga</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total: <b>{keluarga?.length || 0}</b> Kartu Keluarga
          </p>
        </div>
        <Link
          href="/admin/keluarga/tambah"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-lg transition"
        >
          <span>➕</span> Buat KK Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Kepala Keluarga</th>
                <th className="px-4 py-3 text-left">Jumlah Anggota</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {keluarga?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-400">
                    Belum ada data keluarga.
                  </td>
                </tr>
              ) : (
                keluarga?.map((kk) => {
                  const kepala = kk.anggota?.find(
                    (a: any) => a.hubungan === "kepala",
                  )?.jamaah;
                  return (
                    <tr key={kk.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {(kepala as any)?.nama || "-"} <br />
                        <span className="text-xs text-gray-400 font-mono">
                          {(kepala as any)?.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {kk.anggota?.length || 0} orang
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/keluarga/${kk.id}`}
                          className="text-primary-600 hover:underline text-xs font-medium"
                        >
                          Lihat KK
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
