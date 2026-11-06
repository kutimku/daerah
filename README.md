# Sistem Informasi Jamaah & Kegiatan Pengajian Kutai Timur

Aplikasi ini digunakan untuk mendata jamaah, keluarga, jadwal kegiatan, dan absensi secara digital. Dibangun menggunakan Next.js, Supabase, dan Tailwind CSS.

## 🚀 Cara Menjalankan di Lokal

1. Buka terminal di folder project.
2. Jalankan `npm install` (jika baru pertama kali clone).
3. Pastikan file `.env.local` sudah terisi kunci Supabase.
4. Jalankan `npm run dev`.
5. Buka browser ke `http://localhost:3000`.

## 🔑 Akun Admin Default

- Username: `admin`
- Password: `admin123` _(wajib diganti saat login pertama)_

## 📋 Alur Penggunaan Harian

### 1. Pendaftaran Jamaah Baru

- **Oleh Jamaah:** Buka link `/daftar` (bisa dibagikan via WA). Isi data keluarga, klik Kirim.
- **Oleh Admin Kelompok:** Login → Menu **Verifikasi** → Buka pendaftaran → Klik **Setujui**. Data akan otomatis masuk ke Data Jamaah.

### 2. Mengelola Data Keluarga

- Login → Menu **Keluarga** → Buat KK Baru → Pilih Kepala Keluarga.
- Di halaman KK, tambahkan anggota keluarga (Istri/Suami/Anak).

### 3. Membuat Jadwal Kegiatan

- Login → Menu **Kegiatan** → Tambah Kegiatan.
- Jika ingin dipublikasikan ke halaman depan (bisa dilihat umum), centang **Publikasikan**.

### 4. Absensi Kehadiran

- **Manual:** Menu **Absensi** → Pilih Kegiatan → Klik tombol H/I/S/A untuk tiap jamaah → Simpan.
- **QR Code:** Menu **Absensi** → Pilih Kegiatan → Klik tombol QR → Cetak. Tempel di lokasi. Jamaah scan, cari nama, klik Hadir.

### 5. Ekspor Data

- Menu **Jamaah** → Klik tombol **Ekspor Excel**. Data akan terunduh dalam format `.xlsx`.

## 🛠️ Info Teknis

- **Database:** Supabase (PostgreSQL)
- **Frontend/Backend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Autentikasi:** JWT (disimpan di cookie HttpOnly)

## 📦 Deploy ke Vercel (Gratis)

1. Push kode ini ke repository GitHub.
2. Buka [vercel.com](https://vercel.com), import repo GitHub tersebut.
3. Di menu Environment Variables Vercel, masukkan semua isi dari file `.env.local`.
4. Klik Deploy. Aplikasi akan online dalam 1-2 menit.
