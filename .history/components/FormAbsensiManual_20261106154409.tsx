"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_LIST = [
  { value: "hadir", label: "H", color: "bg-green-500" },
  { value: "izin", label: "I", color: "bg-blue-500" },
  { value: "sakit", label: "S", color: "bg-amber-500" },
  { value: "alpa", label: "A", color: "bg-red-500" },
];

export default function FormAbsensiManual({
  kegiatanId,
  jamaahList,
  initialAbsensi,
}: {
  kegiatanId: string;
  jamaahList: any[];
  initialAbsensi: Record<string, string>;
}) {
  const router = useRouter();
  const [absensi, setAbsensi] =
    useState<Record<string, string>>(initialAbsensi);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const filtered = jamaahList.filter((j) =>
    j.nama.toLowerCase().includes(search.toLowerCase()),
  );

  function setStatus(jamaahId: string, status: string) {
    setAbsensi((prev) => ({ ...prev, [jamaahId]: status }));
    setSuccess(false);
  }

  async function handleSimpan() {
    setLoading(true);
    const dataArr = jamaahList.map((j) => ({
      jamaah_id: j.id,
      status: absensi[j.id] || "belum",
    }));

    try {
      const res = await fetch(`/api/absensi/${kegiatanId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataArr }),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      }
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  const rekap = {
    hadir: Object.values(absensi).filter((s) => s === "hadir").length,
    izin: Object.values(absensi).filter((s) => s === "izin").length,
    sakit: Object.values(absensi).filter((s) => s === "sakit").length,
    alpa: Object.values(absensi).filter((s) => s === "alpa").length,
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10">
        <div className="flex gap-4 text-sm font-medium">
          <span className="text-green-600">Hadir: {rekap.hadir}</span>
          <span className="text-blue-600">Izin: {rekap.izin}</span>
          <span className="text-amber-600">Sakit: {rekap.sakit}</span>
          <span className="text-red-600">Alpa: {rekap.alpa}</span>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-64"
          />
          <button
            onClick={handleSimpan}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading
              ? "Menyimpan..."
              : success
                ? "Tersimpan ✓"
                : "Simpan Absensi"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm divide-y">
        {filtered.map((j) => {
          const currentStatus = absensi[j.id] || "belum";
          return (
            <div
              key={j.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">{j.nama}</p>
                <p className="text-xs text-gray-500 font-mono">
                  {j.id} • {j.kelompok?.nama}
                </p>
              </div>

              <div className="flex gap-2">
                {STATUS_LIST.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(j.id, s.value)}
                    className={`w-10 h-10 rounded-full font-bold text-white text-sm transition ${
                      currentStatus === s.value
                        ? s.color
                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
