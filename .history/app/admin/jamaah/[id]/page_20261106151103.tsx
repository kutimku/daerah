import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import {
  formatTanggalPanjang,
  labelStatusPernikahan,
  labelMubalig,
} from "@/lib/utils/format";
import { hitungUmur, tentukanKategori, sudah18BulanMT } from "@/lib/utils/umur";

export const dynamic = "force-dynamic";

export default async function DetailJamaahPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: j } = await supabase
    .from("jamaah")
    .select("*, kelompok:kelompok_id(nama, desa:desa_id(nama))")
    .eq("id", params.id)
    .single();

  if (!j) notFound();

  const umur = hitungUmur(j.tanggal_lahir);
  const kategori = tentukanKategori(j.tanggal_lahir, j.status_pernikahan);
  const lolosMT =
    j.kategori_mubalig === "MT" && sudah18BulanMT(j.tanggal_mulai_mt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/jamaah"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Kembali ke Daftar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">{j.nama}</h1>
          <p className="text-sm text-gray-500 font-mono">ID: {j.id}</p>
        </div>
        <Link
          href={`/admin/jamaah/${j.id}/edit`}
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          ✏️ Edit
        </Link>
      </div>

      {lolosMT && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3">
          🔔 Jamaah ini sudah <b>18 bulan lebih</b> sebagai MT. Pertimbangkan
          untuk diusulkan menjadi MS.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="Data Pribadi">
          <Row
            label="Jenis Kelamin"
            value={j.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
          />
          <Row label="Tempat Lahir" value={j.tempat_lahir} />
          <Row
            label="Tanggal Lahir"
            value={formatTanggalPanjang(j.tanggal_lahir)}
          />
          <Row label="Umur" value={umur !== null ? `${umur} tahun` : "-"} />
          <Row label="Kategori" value={kategori} />
          <Row label="No HP" value={j.no_hp} />
          <Row
            label="Status Pernikahan"
            value={labelStatusPernikahan(j.status_pernikahan)}
          />
          <Row label="Golongan Darah" value={j.golongan_darah} />
        </InfoCard>

        <InfoCard title="Wilayah & Pendidikan">
          <Row label="Kelompok" value={j.kelompok?.nama} />
          <Row label="Desa" value={j.kelompok?.desa?.nama} />
          <Row label="Pendidikan" value={j.pendidikan} />
          <Row label="Pekerjaan" value={j.pekerjaan} />
          <Row
            label="Keterampilan"
            value={
              (j.keterampilan || []).join(", ") +
              (j.keterampilan_lain ? `, ${j.keterampilan_lain}` : "")
            }
          />
          <Row
            label="Tanggal Daftar"
            value={formatTanggalPanjang(j.tanggal_daftar)}
          />
          <Row label="Status" value={j.status} />
        </InfoCard>

        <InfoCard title="Haji & MT/MS">
          <Row
            label="Status Haji"
            value={
              j.status_haji === "sudah"
                ? `Sudah (${j.tahun_haji || "-"})`
                : j.status_haji === "belum"
                  ? "Belum"
                  : "-"
            }
          />
          {j.status_haji === "belum" && (
            <>
              <Row
                label="Sudah Daftar"
                value={
                  j.sudah_daftar_haji === "sudah"
                    ? `Sudah (${j.tahun_daftar_haji || "-"})`
                    : j.sudah_daftar_haji === "belum"
                      ? "Belum"
                      : "-"
                }
              />
              <Row label="Catatan" value={j.catatan_haji} />
            </>
          )}
          <Row
            label="Kategori Mubalig"
            value={labelMubalig(j.kategori_mubalig)}
          />
          {j.kategori_mubalig === "MT" && (
            <Row
              label="Mulai MT"
              value={formatTanggalPanjang(j.tanggal_mulai_mt)}
            />
          )}
        </InfoCard>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 border-b pb-2 mb-3">
        {title}
      </h2>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 text-right font-medium">
        {value || "-"}
      </span>
    </div>
  );
}
