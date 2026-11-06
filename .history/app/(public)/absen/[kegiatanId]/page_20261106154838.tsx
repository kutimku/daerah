"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function AbsenPublikPage() {
  const params = useParams();
  const kegiatanId = params.kegiatanId as string;

  const [search, setSearch] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState("");
  const [error, setError] = useState("");

  // Ambil data jamaah saat mengetik
  useEffect(() => {
    if (search.length < 2) {
      setList([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/absen-publik?q=${search}`)
        .then((res) => res.json())
        .then((data) => setList(data.data || []));
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  async function handleAbsen(jamaahId: string, nama: string) {
    setLoading(true);
    setError("");
    setSukses("");

    try {
      const res = await fetch("/api/absen-publik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kegiatan_id: kegiatanId, jamaah_id: jamaahId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal absen");
      } else {
        setSukses(`Terima kasih, ${nama}. Kehadiran Anda telah tercatat!`);
        setSearch("");
        setList([]);
      }
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-700">
            Absensi Kehadiran
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pengajian Kutai Timur</p>
        </div>

        {sukses && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-medium">
            ✅ {sukses}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <div>
            <label className="text-base font-medium">Cari Nama Anda</label>
            <input
              type="text"
              placeholder="Ketik nama Anda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-2 text-lg py-3"
            />
          </div>

          {loading && (
            <p className="text-center text-sm text-gray-500">Memproses...</p>
          )}

          <div className="divide-y border rounded-lg max-h-80 overflow-y-auto">
            {list.map((j) => (
              <div key={j.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{j.nama}</p>
                  <p className="text-xs text-gray-500">{j.kelompok?.nama}</p>
                </div>
                <button
                  onClick={() => handleAbsen(j.id, j.nama)}
                  disabled={loading}
                  className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  Hadir
                </button>
              </div>
            ))}
            {search.length >= 2 && list.length === 0 && !loading && (
              <p className="text-center text-gray-400 p-4 text-sm">
                Nama tidak ditemukan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
