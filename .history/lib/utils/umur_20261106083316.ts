// ============================================================
// Hitung umur & kategori jamaah
// Aturan (Opsi A):
//   0–1  → Bayi
//   2–4  → PAUD
//   5–12 → Caberawit
//   13–15 → Pra Remaja
//   16–18 → Remaja
//   19+  → Usia Mandiri
//   60+  → Lansia (override, tanpa lihat status pernikahan)
//   Menikah/Janda/Duda & < 60 → Umum
// ============================================================
import type { KategoriUmur, StatusPernikahan } from "@/lib/types";

/**
 * Hitung umur dalam tahun penuh berdasarkan tanggal lahir.
 * Mengembalikan null jika tanggal lahir kosong/invalid.
 */
export function hitungUmur(
  tanggalLahir: string | null | undefined,
): number | null {
  if (!tanggalLahir) return null;
  const lahir = new Date(tanggalLahir);
  if (isNaN(lahir.getTime())) return null;

  const sekarang = new Date();
  let umur = sekarang.getFullYear() - lahir.getFullYear();
  const bulan = sekarang.getMonth() - lahir.getMonth();
  if (bulan < 0 || (bulan === 0 && sekarang.getDate() < lahir.getDate())) {
    umur--;
  }
  return umur >= 0 ? umur : null;
}

/**
 * Tentukan kategori umur berdasarkan tanggal lahir & status pernikahan.
 */
export function tentukanKategori(
  tanggalLahir: string | null | undefined,
  statusPernikahan: StatusPernikahan | null | undefined,
): KategoriUmur {
  const umur = hitungUmur(tanggalLahir);
  if (umur === null) return "Belum Diketahui";

  // Lansia override — 60+ apapun status pernikahannya
  if (umur >= 60) return "Lansia";

  // Menikah/Janda/Duda & < 60 → Umum
  if (
    statusPernikahan === "menikah" ||
    statusPernikahan === "janda" ||
    statusPernikahan === "duda"
  ) {
    return "Umum";
  }

  // Belum menikah & < 60 → berdasarkan umur (Opsi A)
  if (umur <= 1) return "Bayi";
  if (umur <= 4) return "PAUD";
  if (umur <= 12) return "Caberawit";
  if (umur <= 15) return "Pra Remaja";
  if (umur <= 18) return "Remaja";
  return "Usia Mandiri";
}

/**
 * Cek apakah jamaah MT sudah memenuhi masa 18 bulan untuk dipertimbangkan jadi MS.
 */
export function sudah18BulanMT(
  tanggalMulaiMT: string | null | undefined,
): boolean {
  if (!tanggalMulaiMT) return false;
  const mulai = new Date(tanggalMulaiMT);
  if (isNaN(mulai.getTime())) return false;
  const delapanBelasBulan = new Date(mulai);
  delapanBulan: {
    delapanBelasBulan.setMonth(delapanBelasBulan.getMonth() + 18);
  }
  return new Date() >= delapanBelasBulan;
}
