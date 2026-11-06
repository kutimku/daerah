import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatTanggalHari } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createServerClient();

  // Ambil kegiatan yang dipublikasikan & tanggalnya hari ini atau ke depan
  const today = new Date().toISOString().split("T")[0];
  const { data: kegiatan } = await supabase
    .from("kegiatan")
    .select("*, desa:desa_id(nama), kelompok:kelompok_id(nama)")
    .eq("publikasi", true)
    .gte("tanggal", today)
    .order("tanggal", { ascending: true })
    .limit(10);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Publik */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-primary-700 leading-tight">
              Pengajian Kutai Timur
            </h1>
            <p className="text-xs text-gray-500">Sistem Informasi Jamaah</p>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-primary-600 border px-4 py-1.5 rounded-lg"
          >
            Login Pengurus
          </Link>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Jadwal Kegiatan Mendatang
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ikuti kegiatan pengajian di wilayah Kutai Timur. Semua jamaah
            dipersilakan hadir.
          </p>
          <Link
            href="/daftar"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            Daftar Jamaah Baru →
          </Link>
        </div>

        {kegiatan?.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border text-center text-gray-400">
            Belum ada jadwal kegiatan yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kegiatan?.map((k) => (
              <div
                key={k.id}
                className="bg-white rounded-xl border shadow-sm p-5 space-y-3 flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded font-medium uppercase">
                    {k.tingkat}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {k.id}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">{k.nama}</h3>

                <div className="text-sm text-gray-600 space-y-1 flex-1">
                  <p className="flex items-center gap-2">
                    📅 {formatTanggalHari(k.tanggal)}
                  </p>
                  {k.waktu && (
                    <p className="flex items-center gap-2">⏰ {k.waktu}</p>
                  )}
                  {k.lokasi && (
                    <p className="flex items-center gap-2">📍 {k.lokasi}</p>
                  )}
                  {k.pemateri && (
                    <p className="flex items-center gap-2">🎤 {k.pemateri}</p>
                  )}
                  {k.materi && (
                    <p className="flex items-center gap-2">📖 {k.materi}</p>
                  )}
                </div>

                <div className="pt-3 border-t text-xs text-gray-500">
                  Penyelenggara:{" "}
                  <b>
                    {k.penyelenggara ||
                      k.kelompok?.nama ||
                      k.desa?.nama ||
                      "Daerah"}
                  </b>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Pengajian Kutai Timur. All rights reserved.
      </footer>
    </div>
  );
}
