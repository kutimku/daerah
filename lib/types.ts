// ============================================================
// Tipe data untuk seluruh entitas aplikasi
// ============================================================

export type Role = "daerah" | "desa" | "kelompok";

export type StatusJamaah = "aktif" | "nonaktif" | "draft_pindah" | "arsip";

export type JenisKelamin = "L" | "P";

export type StatusPernikahan = "belum_menikah" | "menikah" | "janda" | "duda";

export type GolonganDarah = "A" | "B" | "AB" | "O";

export type KategoriMubalig = "MT" | "MS" | "bukan";

export type StatusHaji = "sudah" | "belum";

export type SudahDaftarHaji = "sudah" | "belum";

export type StatusPendaftaran =
  | "menunggu"
  | "perbaikan"
  | "disetujui"
  | "ditolak";

export type TingkatKegiatan = "kelompok" | "desa" | "daerah";

export type JenisKegiatan = "rutin" | "insidental";

export type StatusAbsensi = "hadir" | "izin" | "sakit" | "alpa";

export type HubunganKeluarga =
  | "kepala"
  | "istri"
  | "suami"
  | "anak"
  | "lainnya";

export type KategoriUmur =
  | "Bayi"
  | "PAUD"
  | "Caberawit"
  | "Pra Remaja"
  | "Remaja"
  | "Usia Mandiri"
  | "Umum"
  | "Lansia"
  | "Belum Diketahui";

export interface Desa {
  id: string;
  nama: string;
  urutan: number;
}

export interface Kelompok {
  id: string;
  desa_id: string;
  nama: string;
  urutan: number;
}

export interface User {
  id: string;
  username: string;
  nama: string;
  role: Role;
  desa_id: string | null;
  kelompok_id: string | null;
  aktif: boolean;
  wajib_ganti_password: boolean;
  last_login_at: string | null;
}

export interface Jamaah {
  id: string;
  nama: string;
  jenis_kelamin: JenisKelamin;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  no_hp: string | null;
  kelompok_id: string;
  status: StatusJamaah;
  tanggal_daftar: string;

  pendidikan: string | null;
  keterampilan: string[];
  keterampilan_lain: string | null;
  pekerjaan: string | null;
  status_pernikahan: StatusPernikahan | null;
  golongan_darah: GolonganDarah | null;

  status_haji: StatusHaji | null;
  tahun_haji: number | null;
  sudah_daftar_haji: SudahDaftarHaji | null;
  tahun_daftar_haji: number | null;
  catatan_haji: string | null;

  kategori_mubalig: KategoriMubalig;
  tanggal_mulai_mt: string | null;

  created_at: string;
  updated_at: string;
}

export interface Keluarga {
  id: string;
  kepala_jamaah_id: string;
  created_at: string;
}

export interface AnggotaKeluarga {
  id: string;
  keluarga_id: string;
  jamaah_id: string;
  hubungan: HubunganKeluarga;
}

export interface Pendaftaran {
  id: string;
  data_json: any; // data KK + anggota yang belum diproses
  status: StatusPendaftaran;
  catatan_admin: string | null;
  token_perbaikan: string | null;
  kelompok_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Kegiatan {
  id: string;
  nama: string;
  jenis: JenisKegiatan;
  tingkat: TingkatKegiatan;
  desa_id: string | null;
  kelompok_id: string | null;
  tanggal: string;
  waktu: string | null;
  lokasi: string | null;
  penyelenggara: string | null;
  pemateri: string | null;
  materi: string | null;
  catatan: string | null;
  publikasi: boolean;
  created_at: string;
  updated_at: string;
}

export interface Absensi {
  id: string;
  kegiatan_id: string;
  jamaah_id: string;
  status: StatusAbsensi;
  waktu_hadir: string | null;
  catatan: string | null;
  created_at: string;
}
