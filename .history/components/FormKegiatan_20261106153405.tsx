"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Kegiatan, Desa, Kelompok } from "@/lib/types";

export default function FormKegiatan({
  initialData,
  desaList,
  kelompokList,
  isEdit = false,
}: {
  initialData?: Partial<Kegiatan>;
  desaList: Desa[];
  kelompokList: Kelompok[];
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<Partial<Kegiatan>>({
    nama: "",
    jenis: "rutin",
    tingkat: "kelompok",
    desa_id: null,
    kelompok_id: null,
    tanggal: new Date().toISOString().split("T")[0],
    waktu: "",
    lokasi: "",
    penyelenggara: "",
    pemateri: "",
    materi: "",
    catatan: "",
    publikasi: false,
    ...initialData,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value, type } = e.target;
    let val: any = value;

    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    } else if (name === "desa_id" || name === "kelompok_id") {
      if (value === "") val = null;
    }

    setForm((prev) => ({ ...prev, [name]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.nama || !form.tanggal || !form.tingkat) {
      setError("Nama, tanggal, dan tingkat wajib diisi");
      setLoading(false);
      return;
    }

    const isEditMode = isEdit && initialData?.id;
    const endpoint = isEditMode
      ? `/api/kegiatan/${initialData!.id}`
      : "/api/kegiatan";
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
      router.push("/admin/kegiatan");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">
          Informasi Kegiatan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>
              Nama Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              name="nama"
              value={form.nama || ""}
              onChange={handleChange}
              required
              placeholder="misal: Pengajian Rutin Mingguan"
            />
          </div>
          <div>
            <label>Jenis Kegiatan</label>
            <select name="jenis" value={form.jenis} onChange={handleChange}>
              <option value="rutin">Rutin</option>
              <option value="insidental">Insidental</option>
            </select>
          </div>
          <div>
            <label>
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tanggal"
              value={form.tanggal || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Waktu</label>
            <input
              name="waktu"
              value={form.waktu || ""}
              onChange={handleChange}
              placeholder="misal: 19:30 - 21:00"
            />
          </div>
          <div className="md:col-span-2">
            <label>Lokasi</label>
            <input
              name="lokasi"
              value={form.lokasi || ""}
              onChange={handleChange}
              placeholder="misal: Masjid Al-Ikhlas PT.A"
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">
          Cakupan & Penyelenggara
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>
              Tingkat Kegiatan <span className="text-red-500">*</span>
            </label>
            <select
              name="tingkat"
              value={form.tingkat}
              onChange={handleChange}
              required
            >
              <option value="kelompok">Kelompok</option>
              <option value="desa">Desa</option>
              <option value="daerah">Daerah</option>
            </select>
          </div>
          <div>
            <label>Penyelenggara</label>
            <input
              name="penyelenggara"
              value={form.penyelenggara || ""}
              onChange={handleChange}
              placeholder="misal: Pengurus Daerah"
            />
          </div>

          {form.tingkat !== "daerah" && (
            <div>
              <label>Desa</label>
              <select
                name="desa_id"
                value={form.desa_id || ""}
                onChange={handleChange}
              >
                <option value="">-- Pilih Desa --</option>
                {desaList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.tingkat === "kelompok" && (
            <div>
              <label>Kelompok</label>
              <select
                name="kelompok_id"
                value={form.kelompok_id || ""}
                onChange={handleChange}
              >
                <option value="">-- Pilih Kelompok --</option>
                {kelompokList
                  .filter((k) => !form.desa_id || k.desa_id === form.desa_id)
                  .map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800 border-b pb-2">
          Materi & Catatan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Pemateri / Mubaligh</label>
            <input
              name="pemateri"
              value={form.pemateri || ""}
              onChange={handleChange}
              placeholder="Nama pemateri"
            />
          </div>
          <div>
            <label>Materi / Judul Kajian</label>
            <input
              name="materi"
              value={form.materi || ""}
              onChange={handleChange}
              placeholder="misal: Bab Sholat"
            />
          </div>
          <div className="md:col-span-2">
            <label>Catatan Singkat</label>
            <textarea
              name="catatan"
              value={form.catatan || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-5 rounded-xl border shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="publikasi"
            checked={form.publikasi}
            onChange={handleChange}
            className="w-5 h-5 accent-primary-600"
          />
          <span className="font-medium text-gray-800">
            Publikasikan ke Halaman Publik
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-8">
          Centang jika kegiatan ini boleh dilihat jamaah tanpa login.
        </p>
      </section>

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
          {loading ? "Menyimpan..." : "Simpan Kegiatan"}
        </button>
      </div>
    </form>
  );
}
