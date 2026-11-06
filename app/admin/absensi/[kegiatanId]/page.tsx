import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatTanggalHari } from "@/lib/utils/format";
import FormAbsensiManual from "@/components/FormAbsensiManual";

export const dynamic = "force-dynamic";

export default async function AbsensiManualPage({
  params,
}: {
  params: { kegiatanId: string };
}) {
  const supabase = createServerClient();

  const { data: kegiatan } = await supabase
    .from("kegiatan")
    .select("*")
    .eq("id", params.kegiatanId)
    .single();
  if (!kegiatan) notFound();

  const { data: jamaahList } = await supabase
    .from("jamaah")
    .select("id, nama, kelompok:kelompok_id(nama)")
    .eq("status", "aktif")
    .order("nama");

  const { data: absensiList } = await supabase
    .from("absensi")
    .select("jamaah_id, status")
    .eq("kegiatan_id", params.kegiatanId);

  // Gabungkan data absensi lama ke form
  const initialAbsensi: Record<string, string> = {};
  absensiList?.forEach((a) => {
    initialAbsensi[a.jamaah_id] = a.status;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link
            href="/admin/absensi"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Kembali
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Absensi: {kegiatan.nama}
          </h1>
          <p className="text-sm text-gray-500">
            {formatTanggalHari(kegiatan.tanggal)} • {kegiatan.waktu}
          </p>
        </div>
        <Link
          href={`/admin/absensi/${params.kegiatanId}/qr`}
          target="_blank"
          className="bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          🖨️ Cetak QR
        </Link>
      </div>

      <FormAbsensiManual
        kegiatanId={params.kegiatanId}
        jamaahList={jamaahList || []}
        initialAbsensi={initialAbsensi}
      />
    </div>
  );
}
