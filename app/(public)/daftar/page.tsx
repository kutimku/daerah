"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DaftarPublikPage() {
  const [desaList, setDesaList] = useState<any[]>([]);
  const [kelompokList, setKelompokList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  // Data KK
  const [kepala, setKepala] = useState({
    nama: "",
    jenis_kelamin: "L",
    tempat_lahir: "",
    tanggal_lahir: "",
    no_hp: "",
    kelompok_id: "",
  });

  // Data Anggota (Array)
  const [anggota, setAnggota] = useState<any[]>([]);

  // Fetch desa & kelompok dari Supabase (butuh endpoint publik)
  // Untuk simple-nya, kita pakai Supabase Client langsung karena read-only
  useEffect(() => {
    fetch("/api/wilayah")
      .then((res) => res.json())
      .then((data) => {
        setDesaList(data.desa || []);
        setKelompokList(data.kelompok || []);
      })
      .catch((err) => {
        console.error("Gagal ambil wilayah:", err);
      });
  }, []);

  function handleAddAnggota() {
    setAnggota([
      ...anggota,
      {
        nama: "",
        jenis_kelamin: "P",
        tempat_lahir: "",
        tanggal_lahir: "",
        hubungan: "anak",
      },
    ]);
  }

  function handleRemoveAnggota(index: number) {
    setAnggota(anggota.filter((_, i) => i !== index));
  }

  function handleAnggotaChange(index: number, field: string, value: string) {
    const newArr = [...anggota];
    newArr[index][field] = value;
    setAnggota(newArr);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kepala, anggota }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengirim data");
      } else {
        setSukses(true);
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  if (sukses) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pendaftaran Terkirim!
          </h1>
          <p className="text-gray-600 mb-6">
            Data keluarga Anda sudah masuk ke antrean. Admin kelompok akan
            memverifikasi dalam waktu dekat.
          </p>
          <Link href="/" className="text-primary-600 hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-700">
            Pendaftaran Jamaah
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pengajian Kutai Timur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION KEPALA KELUARGA */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold border-b pb-2">
              Data Kepala Keluarga
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Nama Lengkap *</label>
                <input
                  required
                  value={kepala.nama}
                  onChange={(e) =>
                    setKepala({ ...kepala, nama: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Jenis Kelamin *</label>
                <select
                  value={kepala.jenis_kelamin}
                  onChange={(e) =>
                    setKepala({ ...kepala, jenis_kelamin: e.target.value })
                  }
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label>Tempat Lahir</label>
                <input
                  value={kepala.tempat_lahir}
                  onChange={(e) =>
                    setKepala({ ...kepala, tempat_lahir: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Tanggal Lahir</label>
                <input
                  type="date"
                  value={kepala.tanggal_lahir}
                  onChange={(e) =>
                    setKepala({ ...kepala, tanggal_lahir: e.target.value })
                  }
                />
              </div>
              <div>
                <label>No HP</label>
                <input
                  value={kepala.no_hp}
                  onChange={(e) =>
                    setKepala({ ...kepala, no_hp: e.target.value })
                  }
                  placeholder="08xx"
                />
              </div>
              <div>
                <label>Kelompok Sambung *</label>
                <select
                  required
                  value={kepala.kelompok_id}
                  onChange={(e) =>
                    setKepala({ ...kepala, kelompok_id: e.target.value })
                  }
                >
                  <option value="">-- Pilih Kelompok --</option>
                  {desaList.map((d: any) => (
                    <optgroup key={d.id} label={d.nama}>
                      {kelompokList
                        .filter((k: any) => k.desa_id === d.id)
                        .map((k: any) => (
                          <option key={k.id} value={k.id}>
                            {k.nama}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION ANGGOTA KELUARGA */}
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="font-semibold">Anggota Keluarga Lainnya</h2>
              <button
                type="button"
                onClick={handleAddAnggota}
                className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-lg font-medium"
              >
                + Tambah Anggota
              </button>
            </div>

            {anggota.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                Belum ada anggota (bisa Istri/Suami/Anak). Klik tombol di atas.
              </p>
            )}

            {anggota.map((agg, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50 relative space-y-3"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveAnggota(index)}
                  className="absolute top-2 right-2 text-red-500 text-sm font-bold"
                >
                  ✕
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label>Nama Lengkap</label>
                    <input
                      value={agg.nama}
                      onChange={(e) =>
                        handleAnggotaChange(index, "nama", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label>Hubungan</label>
                    <select
                      value={agg.hubungan}
                      onChange={(e) =>
                        handleAnggotaChange(index, "hubungan", e.target.value)
                      }
                    >
                      <option value="istri">Istri</option>
                      <option value="suami">Suami</option>
                      <option value="anak">Anak</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label>Jenis Kelamin</label>
                    <select
                      value={agg.jenis_kelamin}
                      onChange={(e) =>
                        handleAnggotaChange(
                          index,
                          "jenis_kelamin",
                          e.target.value,
                        )
                      }
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label>Tanggal Lahir</label>
                    <input
                      type="date"
                      value={agg.tanggal_lahir}
                      onChange={(e) =>
                        handleAnggotaChange(
                          index,
                          "tanggal_lahir",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white font-medium px-8 py-3 rounded-xl hover:bg-primary-700 w-full md:w-auto"
            >
              {loading ? "Mengirim..." : "Kirim Pendaftaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
