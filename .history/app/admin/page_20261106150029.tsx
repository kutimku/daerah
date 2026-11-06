import { getUser } from "@/lib/auth/get-user";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getUser();
  const supabase = createServerClient();

  // Ambil total seluruh jamaah
  const { count: totalJamaah } = await supabase
    .from("jamaah")
    .select("*", { count: "exact", head: true })
    .eq("status", "aktif");

  // Ambil total kelompok & desa
  const { count: totalKelompok } = await supabase
    .from("kelompok")
    .select("*", { count: "exact", head: true });
  const { count: totalDesa } = await supabase
    .from("desa")
    .select("*", { count: "exact", head: true });

  // Data dummy untuk antrean verifikasi (nanti kita hubungkan)
  const totalAntrean = 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Halo, {user?.nama} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang di Sistem Informasi Pengajian Kutai Timur.
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">
            Total Jamaah Aktif
          </p>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {totalJamaah || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Kelompok</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {totalKelompok || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Desa</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {totalDesa || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-amber-400">
          <p className="text-sm text-gray-500 font-medium">
            Menunggu Verifikasi
          </p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {totalAntrean}
          </p>
        </div>
      </div>

      {/* Placeholder Grafik */}
      <div className="bg-white p-6 rounded-xl border shadow-sm h-64 flex flex-col items-center justify-center text-gray-400">
        <span className="text-3xl mb-2">📈</span>
        <p>Grafik Perkembangan Jamaah akan tampil di sini</p>
      </div>
    </div>
  );
}
