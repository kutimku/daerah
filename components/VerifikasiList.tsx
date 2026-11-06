"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { labelStatusPendaftaran } from "@/lib/utils/format";

export default function VerifikasiList({ data }: { data: any[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<any>(null);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAksi(aksi: string) {
    if (!selected) return;
    if ((aksi === "tolak" || aksi === "perbaikan") && !catatan) {
      setError("Catatan wajib diisi untuk aksi ini");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/pendaftaran/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aksi, catatan }),
      });
      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "Gagal memproses");
      } else {
        setSelected(null);
        setCatatan("");
        router.refresh();
      }
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Tgl Masuk</th>
              <th className="px-4 py-3 text-left">Nama KK</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  Belum ada antrean.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {item.data_json?.kepala?.nama || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        item.status === "menunggu"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "perbaikan"
                            ? "bg-blue-100 text-blue-800"
                            : item.status === "disetujui"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {labelStatusPendaftaran(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(item)}
                      className="text-primary-600 hover:underline text-xs font-medium"
                    >
                      Buka
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">Detail Pendaftaran</h2>
              <button
                onClick={() => {
                  setSelected(null);
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-primary-700 mb-1">
                  Kepala Keluarga
                </p>
                <p>
                  {selected.data_json?.kepala?.nama} (
                  {selected.data_json?.kepala?.jenis_kelamin})
                </p>
                <p className="text-xs text-gray-500">
                  Tgl Lahir: {selected.data_json?.kepala?.tanggal_lahir || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  No HP: {selected.data_json?.kepala?.no_hp || "-"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">
                  Anggota Keluarga:
                </p>
                {selected.data_json?.anggota?.length ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {selected.data_json.anggota.map((a: any, i: number) => (
                      <li key={i}>
                        {a.nama} ({a.hubungan}) -{" "}
                        {a.tanggal_lahir || "tgl blm diisi"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">Tidak ada anggota.</p>
                )}
              </div>

              {selected.status === "menunggu" && (
                <>
                  <div>
                    <label>
                      Catatan Admin (wajib jika menolak/minta perbaikan)
                    </label>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      rows={3}
                      placeholder="misal: Mohon lengkapi tanggal lahir anak ke-2"
                    />
                  </div>

                  {error && <p className="text-red-600 text-xs">{error}</p>}

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button
                      onClick={() => handleAksi("setuju")}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      ✅ Setujui
                    </button>
                    <button
                      onClick={() => handleAksi("perbaikan")}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      📝 Minta Perbaikan
                    </button>
                    <button
                      onClick={() => handleAksi("tolak")}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      ❌ Tolak
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
