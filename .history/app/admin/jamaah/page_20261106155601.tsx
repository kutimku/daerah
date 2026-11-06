import TombolEksporExcel from "@/components/TombolEksporExcel";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { formatTanggalPendek } from "@/lib/utils/format";
import { tentukanKategori } from "@/lib/utils/umur";
import { warnaKategori } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function JamaahPage({
  searchParams,
}: {
  searchParams: { q?: string; kelompok?: string };
}) {
  const user = await getUser();
  const supabase = createServerClient();

  // Filter berdasarkan role
  let query = supabase
    .from("jamaah")
    .select("*, kelompok:kelompok_id(nama, desa_id)")
    .eq("status", "aktif")
    .order("nama");

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

  if (searchParams.q) {
    query = query.ilike("nama", `%${searchParams.q}%`);
  }
  if (searchParams.kelompok) {
    query = query.eq("kelompok_id", searchParams.kelompok);
  }

  const { data: jamaah } = await query;

  // Untuk filter dropdown
  const { data: kelompokList } = await supabase
    .from("kelompok")
    .select("id, nama")
    .order("nama");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Jamaah</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total: <b>{jamaah?.length || 0}</b> jamaah aktif
          </p>
        </div>
        <Link
          href="/admin/jamaah/tambah"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-lg transition"
        >
          <span>➕</span> Tambah Jamaah
        </Link>
      </div>

      {/* Filter */}
      <form className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-3">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q || ""}
          placeholder="Cari nama jamaah..."
          className="flex-1"
        />
        <select
          name="kelompok"
          defaultValue={searchParams.kelompok || ""}
          className="md:w-64"
        >
          <option value="">-- Semua Kelompok --</option>
          {kelompokList?.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Cari
        </button>
      </form>

      {/* Tabel */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">L/P</th>
                <th className="px-4 py-3 text-left">Tgl Lahir</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Kelompok</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jamaah?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Belum ada jamaah. Klik "Tambah Jamaah" untuk mulai.
                  </td>
                </tr>
              ) : (
                jamaah?.map((j: any) => {
                  const kat = tentukanKategori(
                    j.tanggal_lahir,
                    j.status_pernikahan,
                  );
                  return (
                    <tr key={j.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                      <td className="px-4 py-3 font-medium">{j.nama}</td>
                      <td className="px-4 py-3">{j.jenis_kelamin}</td>
                      <td className="px-4 py-3">
                        {formatTanggalPendek(j.tanggal_lahir)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-full ${warnaKategori(kat)}`}
                        >
                          {kat}
                        </span>
                      </td>
                      <td className="px-4 py-3">{j.kelompok?.nama || "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/jamaah/${j.id}`}
                          className="text-primary-600 hover:underline text-xs font-medium"
                        >
                          Lihat
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
