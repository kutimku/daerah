import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatTanggalHari } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function KegiatanPage() {
  const supabase = createServerClient();
  const { data: list } = await supabase
    .from("kegiatan")
    .select("*, desa:desa_id(nama), kelompok:kelompok_id(nama)")
    .order("tanggal", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total: {list?.length || 0} kegiatan
          </p>
        </div>
        <Link
          href="/admin/kegiatan/tambah"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-lg transition"
        >
          <span>➕</span> Tambah Kegiatan
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nama Kegiatan</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-left">Tingkat</th>
                <th className="px-4 py-3 text-left">Publikasi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Belum ada kegiatan.
                  </td>
                </tr>
              ) : (
                list?.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{k.id}</td>
                    <td className="px-4 py-3 font-medium">{k.nama}</td>
                    <td className="px-4 py-3">
                      {formatTanggalHari(k.tanggal)}
                    </td>
                    <td className="px-4 py-3 capitalize">{k.tingkat}</td>
                    <td className="px-4 py-3">
                      {k.publikasi ? (
                        <span className="text-green-600 text-xs font-medium">
                          ✓ Publik
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Draf</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/kegiatan/${k.id}/edit`}
                        className="text-primary-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
