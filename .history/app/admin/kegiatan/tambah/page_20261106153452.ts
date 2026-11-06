import { createServerClient } from '@/lib/supabase/server';
import FormKegiatan from '@/components/FormKegiatan';

export default async function TambahKegiatanPage() {
  const supabase = createServerClient();
  const [{ data: desa }, { data: kelompok }] = await Promise.all([
    supabase.from('desa').select('*').order('urutan'),
    supabase.from('kelompok').select('*').order('nama'),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Kegiatan</h1>
        <p className="text-gray-500 text-sm mt-1">Buat jadwal pengajian atau kegiatan baru.</p>
      </div>
      <FormKegiatan desaList={desa || []} kelompokList={kelompok || []} />
    </div>
  );
}