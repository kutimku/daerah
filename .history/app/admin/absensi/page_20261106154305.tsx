import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatTanggalHari } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AbsensiPage() {
  const supabase = createServerClient();

  // Urutkan dari yang terbaru
  const { data: list } = await supabase
    .from("kegiatan")
    .select("*")
    .order("tanggal", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Pilih Kegiatan untuk Absensi
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pilih kegiatan di bawah ini untuk mulai mengabsen jamaah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list?.map((k) => (
          <div
            key={k.id}
            className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <span className="text-xs font-mono text-gray-400">{k.id}</span>
              <h3 className="font-bold text-gray-800 text-lg leading-tight mt-1">
                {k.nama}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {formatTanggalHari(k.tanggal)}
              </p>
              <p className="text-sm text-gray-500">{k.waktu || "-"}</p>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <Link
                href={`/admin/absensi/${k.id}`}
                className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 rounded-lg transition"
              >
                Isi Absensi
              </Link>
              <Link
                href={`/admin/absensi/${k.id}/qr`}
                target="_blank"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition"
                title="Cetak QR Code"
              >
                🖨️ QR
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
