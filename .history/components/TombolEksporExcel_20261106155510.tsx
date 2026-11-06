"use client";

import { useState } from "react";
import { exportKeExcel } from "@/lib/utils/excel";
import { tentukanKategori } from "@/lib/utils/umur";
import { formatTanggalPendek } from "@/lib/utils/format";

export default function TombolEksporExcel() {
  const [loading, setLoading] = useState(false);

  async function handleEkspor() {
    setLoading(true);
    try {
      const res = await fetch("/api/jamaah");
      const json = await res.json();

      if (!json.data) throw new Error("Gagal mengambil data");

      // Format ulang data agar rapi saat masuk Excel
      const rows = json.data.map((j: any) => ({
        id: j.id,
        nama: j.nama,
        jenis_kelamin: j.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
        tanggal_lahir: formatTanggalPendek(j.tanggal_lahir),
        kategori_umur: tentukanKategori(j.tanggal_lahir, j.status_pernikahan),
        no_hp: j.no_hp || "-",
        kelompok: j.kelompok?.nama || "-",
        desa: j.kelompok?.desa?.nama || "-",
        status: j.status,
        tanggal_daftar: formatTanggalPendek(j.tanggal_daftar),
      }));

      const headers = {
        id: "ID Jamaah",
        nama: "Nama Lengkap",
        jenis_kelamin: "Jenis Kelamin",
        tanggal_lahir: "Tanggal Lahir",
        kategori_umur: "Kategori Umur",
        no_hp: "No HP",
        kelompok: "Kelompok",
        desa: "Desa",
        status: "Status",
        tanggal_daftar: "Tgl Daftar",
      };

      exportKeExcel(
        rows,
        headers,
        `Data_Jamaah_Aktif_${new Date().toISOString().split("T")[0]}`,
      );
    } catch (err) {
      alert("Gagal mengekspor data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleEkspor}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-lg transition disabled:opacity-50"
    >
      <span>📥</span> {loading ? "Menyiapkan..." : "Ekspor Excel"}
    </button>
  );
}
