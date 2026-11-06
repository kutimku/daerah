"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TambahKeluargaPage() {
  const router = useRouter();
  const [jamaahList, setJamaahList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/jamaah")
      .then((res) => res.json())
      .then((data) => setJamaahList(data.data || []));
  }, []);

  const filtered = jamaahList.filter(
    (j) =>
      j.nama.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) {
      setError("Pilih kepala keluarga terlebih dahulu");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/keluarga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kepala_jamaah_id: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat KK");
        setLoading(false);
        return;
      }
      router.push(`/admin/keluarga/${data.id}`);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Buat Kartu Keluarga Baru
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pilih satu jamaah sebagai Kepala Keluarga. Anggota lain bisa
          ditambahkan setelahnya.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border shadow-sm space-y-4"
      >
        <div>
          <label>
            Kepala Keluarga <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Cari nama atau ID jamaah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />

          <div className="border rounded-lg max-h-60 overflow-y-auto divide-y">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-gray-400">
                Tidak ada jamaah yang cocok.
              </p>
            ) : (
              filtered.map((j) => (
                <label
                  key={j.id}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedId === j.id ? "bg-primary-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="kepala"
                    value={j.id}
                    checked={selectedId === j.id}
                    onChange={() => setSelectedId(j.id)}
                    className="w-4 h-4 mr-3 accent-primary-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{j.nama}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {j.id} • {j.kelompok?.nama}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Buat KK"}
          </button>
        </div>
      </form>
    </div>
  );
}
