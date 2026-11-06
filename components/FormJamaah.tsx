"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Jamaah, Kelompok, Desa } from "@/lib/types";
import { hitungUmur, tentukanKategori } from "@/lib/utils/umur";

const KETERAMPILAN_PILIHAN = [
  "Mengaji/Qiroah",
  "Khotbah/Ceramah",
  "Kepemimpinan",
  "Administrasi",
  "IT/Komputer",
  "Kesehatan",
  "Pertanian",
  "Perikanan",
  "Pertambangan",
  "Wirausaha",
];

const PENDIDIKAN_PILIHAN = [
  "Tidak Sekolah",
  "SD",
  "SMP",
  "SMA/SMK",
  "D3",
  "S1",
  "S2",
  "S3",
];

const PEKERJAAN_PILIHAN = [
  "Tidak Bekerja",
  "Petani",
  "Nelayan",
  "Buruh",
  "Karyawan Swasta",
  "Karyawan Tambang",
  "PNS/ASN",
  "TNI/Polri",
  "Wirausaha/Pedagang",
  "Guru",
  "Ibu Rumah Tangga",
  "Pensiunan",
  "Pelajar/Mahasiswa",
  "Lainnya",
];

export default function FormJamaah({
  initialData,
  kelompokList,
  desaList,
  isEdit = false,
}: {
  initialData?: Partial<Jamaah>;
  kelompokList: Kelompok[];
  desaList: Desa[];
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State form
  const [form, setForm] = useState<Partial<Jamaah>>({
    nama: "",
    jenis_kelamin: "L",
    tempat_lahir: "",
    tanggal_lahir: "",
    no_hp: "",
    kelompok_id: "",
    status: "aktif",
    pendidikan: "",
    keterampilan: [],
    keterampilan_lain: "",
    pekerjaan: "",
    status_pernikahan: "belum_menikah",
    golongan_darah: null,
    status_haji: null,
    tahun_haji: null,
    sudah_daftar_haji: null,
    tahun_daftar_haji: null,
    catatan_haji: "",
    kategori_mubalig: "bukan",
    tanggal_mulai_mt: null,
    ...initialData,
  });

  // State kelompok terfilter berdasarkan desa
  const [filterDesa, setFilterDesa] = useState<string>("");

  // Set filter desa saat edit
  useEffect(() => {
    if (initialData?.kelompok_id) {
      const k = kelompokList.find((k) => k.id === initialData.kelompok_id);
      if (k) setFilterDesa(k.desa_id);
    }
  }, [initialData, kelompokList]);

  const kelompokTampil = filterDesa
    ? kelompokList.filter((k) => k.desa_id === filterDesa)
    : kelompokList;

  const umur = hitungUmur(form.tanggal_lahir);
  const kategori = tentukanKategori(form.tanggal_lahir, form.status_pernikahan);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value, type } = e.target;
    let val: any = value;

    if (name === "golongan_darah" && value === "") val = null;
    if (name === "status_haji" && value === "") val = null;
    if (name === "sudah_daftar_haji" && value === "") val = null;

    setForm((prev) => ({ ...prev, [name]: val }));
  }

  function handleKeterampilan(k: string) {
    setForm((prev) => {
      const arr = prev.keterampilan || [];
      if (arr.includes(k))
        return { ...prev, keterampilan: arr.filter((x) => x !== k) };
      return { ...prev, keterampilan: [...arr, k] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi
    if (!form.nama || !form.kelompok_id) {
      setError("Nama dan Kelompok wajib diisi");
      setLoading(false);
      return;
    }

    const isEditMode = isEdit && initialData?.id;
    const endpoint = isEditMode
      ? `/api/jamaah/${initialData!.id}`
      : "/api/jamaah";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan");
        setLoading(false);
        return;
      }
      router.push("/admin/jamaah");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* --- DATA UTAMA --- */}
      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">
          Data Utama
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              name="nama"
              value={form.nama || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select
              name="jenis_kelamin"
              value={form.jenis_kelamin}
              onChange={handleChange}
              required
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label>Tempat Lahir</label>
            <input
              name="tempat_lahir"
              value={form.tempat_lahir || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={form.tanggal_lahir || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Nomor HP (opsional)</label>
            <input
              name="no_hp"
              value={form.no_hp || ""}
              onChange={handleChange}
              placeholder="08xx"
            />
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="arsip">Arsip</option>
            </select>
          </div>
        </div>

        {umur !== null && (
          <div className="bg-blue-50 text-blue-800 text-sm rounded-lg px-3 py-2">
            Umur: <b>{umur} tahun</b> — Kategori: <b>{kategori}</b>
          </div>
        )}
      </section>

      {/* --- WILAYAH --- */}
      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Wilayah</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Pilih Desa (filter)</label>
            <select
              value={filterDesa}
              onChange={(e) => setFilterDesa(e.target.value)}
            >
              <option value="">-- Semua Desa --</option>
              {desaList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>
              Kelompok Sambung <span className="text-red-500">*</span>
            </label>
            <select
              name="kelompok_id"
              value={form.kelompok_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Kelompok --</option>
              {kelompokTampil.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* --- DATA TAMBAHAN --- */}
      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">
          Data Tambahan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Pendidikan Terakhir</label>
            <select
              name="pendidikan"
              value={form.pendidikan || ""}
              onChange={handleChange}
            >
              <option value="">-- Pilih --</option>
              {PENDIDIKAN_PILIHAN.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Pekerjaan</label>
            <select
              name="pekerjaan"
              value={form.pekerjaan || ""}
              onChange={handleChange}
            >
              <option value="">-- Pilih --</option>
              {PEKERJAAN_PILIHAN.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Status Pernikahan</label>
            <select
              name="status_pernikahan"
              value={form.status_pernikahan || "belum_menikah"}
              onChange={handleChange}
            >
              <option value="belum_menikah">Belum Menikah</option>
              <option value="menikah">Menikah</option>
              <option value="janda">Janda</option>
              <option value="duda">Duda</option>
            </select>
          </div>
          <div>
            <label>Golongan Darah (opsional)</label>
            <select
              name="golongan_darah"
              value={form.golongan_darah || ""}
              onChange={handleChange}
            >
              <option value="">-- Pilih --</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
        </div>

        <div>
          <label>Keterampilan (bisa pilih lebih dari satu)</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {KETERAMPILAN_PILIHAN.map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => handleKeterampilan(k)}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  form.keterampilan?.includes(k)
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          {form.keterampilan?.length ? (
            <div className="mt-2">
              <label>Keterampilan Lainnya (opsional)</label>
              <input
                name="keterampilan_lain"
                value={form.keterampilan_lain || ""}
                onChange={handleChange}
                placeholder="misal: menjahit, memanah"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* --- DATA HAJI --- */}
      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">Data Haji</h2>
        <div>
          <label>Status Haji</label>
          <select
            name="status_haji"
            value={form.status_haji || ""}
            onChange={handleChange}
          >
            <option value="">-- Pilih --</option>
            <option value="sudah">Sudah Haji</option>
            <option value="belum">Belum Haji</option>
          </select>
        </div>

        {form.status_haji === "sudah" && (
          <div>
            <label>Tahun Pelaksanaan Haji</label>
            <input
              type="number"
              name="tahun_haji"
              value={form.tahun_haji || ""}
              onChange={handleChange}
              placeholder="misal: 2019"
            />
          </div>
        )}

        {form.status_haji === "belum" && (
          <div className="space-y-4">
            <div>
              <label>Apakah sudah mendaftar haji?</label>
              <select
                name="sudah_daftar_haji"
                value={form.sudah_daftar_haji || ""}
                onChange={handleChange}
              >
                <option value="">-- Pilih --</option>
                <option value="sudah">Sudah Mendaftar</option>
                <option value="belum">Belum Mendaftar</option>
              </select>
            </div>

            {form.sudah_daftar_haji === "sudah" && (
              <div>
                <label>Tahun Pendaftaran Haji (opsional)</label>
                <input
                  type="number"
                  name="tahun_daftar_haji"
                  value={form.tahun_daftar_haji || ""}
                  onChange={handleChange}
                  placeholder="misal: 2023"
                />
              </div>
            )}

            {form.sudah_daftar_haji === "belum" && (
              <div>
                <label>Catatan Alasan (opsional)</label>
                <textarea
                  name="catatan_haji"
                  value={form.catatan_haji || ""}
                  onChange={handleChange}
                  rows={2}
                  placeholder="misal: belum ada biaya, dsb."
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* --- KATEGORI MT/MS --- */}
      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">
          Kategori Mubalig (MT/MS)
        </h2>
        <div>
          <label>Kategori</label>
          <select
            name="kategori_mubalig"
            value={form.kategori_mubalig || "bukan"}
            onChange={handleChange}
          >
            <option value="bukan">Bukan Keduanya</option>
            <option value="MT">MT (Mubalig Tugasan)</option>
            <option value="MS">MS (Mubalig Setempat)</option>
          </select>
        </div>

        {form.kategori_mubalig === "MT" && (
          <div>
            <label>Tanggal Mulai Menjadi MT</label>
            <input
              type="date"
              name="tanggal_mulai_mt"
              value={form.tanggal_mulai_mt || ""}
              onChange={handleChange}
            />
          </div>
        )}
      </section>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>
    </form>
  );
}
