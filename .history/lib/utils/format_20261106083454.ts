// ============================================================
// Helper format tanggal, label, dll (Bahasa Indonesia)
// ============================================================
import type {
  StatusJamaah,
  StatusAbsensi,
  KategoriMubalig,
  StatusPendaftaran,
  StatusPernikahan,
} from "@/lib/types";

const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const HARI_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

/** Format tanggal ke "05 Januari 2025" */
export function formatTanggalPanjang(tgl: string | null | undefined): string {
  if (!tgl) return "-";
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")} ${BULAN_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/** Format tanggal ke "05/01/2025" */
export function formatTanggalPendek(tgl: string | null | undefined): string {
  if (!tgl) return "-";
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return "-";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/** Format tanggal + hari ke "Senin, 05 Januari 2025" */
export function formatTanggalHari(tgl: string | null | undefined): string {
  if (!tgl) return "-";
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return "-";
  return `${HARI_ID[d.getDay()]}, ${formatTanggalPanjang(tgl)}`;
}

/** Format waktu ISO ke "19:30" */
export function formatJam(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Label status jamaah */
export function labelStatusJamaah(s: StatusJamaah): string {
  const map: Record<StatusJamaah, string> = {
    aktif: "Aktif",
    nonaktif: "Nonaktif",
    draft_pindah: "Dalam Draft Perpindahan",
    arsip: "Arsip",
  };
  return map[s] ?? s;
}

/** Label status absensi */
export function labelAbsensi(s: StatusAbsensi): string {
  const map: Record<StatusAbsensi, string> = {
    hadir: "Hadir",
    izin: "Izin",
    sakit: "Sakit",
    alpa: "Tanpa Keterangan",
  };
  return map[s] ?? s;
}

/** Label kategori mubalig */
export function labelMubalig(s: KategoriMubalig): string {
  const map: Record<KategoriMubalig, string> = {
    MT: "MT (Mubalig Tugasan)",
    MS: "MS (Mubalig Setempat)",
    bukan: "Bukan Keduanya",
  };
  return map[s] ?? s;
}

/** Label status pendaftaran */
export function labelStatusPendaftaran(s: StatusPendaftaran): string {
  const map: Record<StatusPendaftaran, string> = {
    menunggu: "Menunggu Verifikasi",
    perbaikan: "Perlu Perbaikan",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };
  return map[s] ?? s;
}

/** Label status pernikahan */
export function labelStatusPernikahan(s: StatusPernikahan | null): string {
  if (!s) return "-";
  const map: Record<StatusPernikahan, string> = {
    belum_menikah: "Belum Menikah",
    menikah: "Menikah",
    janda: "Janda",
    duda: "Duda",
  };
  return map[s] ?? s;
}

/** Warna badge kategori umur (untuk tampilan) */
export function warnaKategori(kategori: string): string {
  const map: Record<string, string> = {
    Bayi: "bg-pink-100 text-pink-800",
    PAUD: "bg-purple-100 text-purple-800",
    Caberawit: "bg-blue-100 text-blue-800",
    "Pra Remaja": "bg-cyan-100 text-cyan-800",
    Remaja: "bg-teal-100 text-teal-800",
    "Usia Mandiri": "bg-green-100 text-green-800",
    Umum: "bg-emerald-100 text-emerald-800",
    Lansia: "bg-amber-100 text-amber-800",
    "Belum Diketahui": "bg-gray-100 text-gray-600",
  };
  return map[kategori] ?? "bg-gray-100 text-gray-700";
}
