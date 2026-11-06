"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FormTambahAnggota({
  keluargaId,
}: {
  keluargaId: string;
}) {
  const router = useRouter();
  const [jamaahList, setJamaahList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [hubungan, setHubungan] = useState("anak");
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
      setError("Pilih jamaah dulu");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/keluarga/${keluargaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jamaah_id: selectedId, hubungan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menambah anggota");
        setLoading(false);
        return;
      }
      setSelectedId("");
      setSearch("");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
      <h2 className="font-semibold text-gray-800 border-b pb-2">
        Tambah Anggota
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label>Cari Jamaah</label>
          <input
            type="text"
            placeholder="Ketik nama atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="border rounded-lg max-h-40 overflow-y-auto divide-y text-sm">
            {filtered.length === 0 ? (
              <p className="p-3 text-gray-400">Tidak ditemukan.</p>
            ) : (
              filtered.map((j) => (
                <label
                  key={j.id}
                  className={`flex items-center p-2 cursor-pointer hover:bg-gray-50 ${selectedId === j.id ? "bg-primary-50" : ""}`}
                >
                  <input
                    type="radio"
                    name="anggota"
                    checked={selectedId === j.id}
                    onChange={() => setSelectedId(j.id)}
                    className="w-4 h-4 mr-2 accent-primary-600"
                  />
                  <div>
                    <p className="font-medium">{j.nama}</p>
                    <p className="text-xs text-gray-500 font-mono">{j.id}</p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div>
          <label>Hubungan</label>
          <select
            value={hubungan}
            onChange={(e) => setHubungan(e.target.value)}
          >
            <option value="istri">Istri</option>
            <option value="suami">Suami</option>
            <option value="anak">Anak</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "+ Tambahkan"}
        </button>
      </form>
    </div>
  );
}
