import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const supabase = createServerClient();

    // 1. Ambil user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .single();

    if (error || !user) {
      return NextResponse.json({
        error: "User tidak ditemukan",
        detail: error,
      });
    }

    // 2. Lihat panjang hash & karakter aneh
    const hashDariDB = user.password_hash;
    const hashBersih = hashDariDB.trim(); // buang spasi/newline di ujung

    // 3. Coba bandingkan dengan beberapa metode
    const cek1 = await bcrypt.compare("admin123", hashDariDB); // metode standar
    const cek2 = await bcrypt.compare("admin123", hashBersih); // metode dibersihkan
    const cek3 = await bcrypt.compare("Admin123", hashDariDB); // cek case-sensitive
    const cek4 = await bcrypt.compare("admin", hashDariDB); // cek tanpa angka

    // 4. Buat hash baru langsung dari server untuk referensi
    const hashBaru = await bcrypt.hash("admin123", 10);
    const cekHashBaru = await bcrypt.compare("admin123", hashBaru);

    return NextResponse.json({
      status: "OK",
      info_hash_db: {
        panjang: hashDariDB.length, // Harusnya 60
        awal: hashDariDB.substring(0, 10) + "...",
        akhir: "..." + hashDariDB.slice(-10),
        ada_spasi_aneh: hashDariDB !== hashBersih,
        karakter_tak_terlihat: JSON.stringify(hashDariDB.slice(0, 5)),
      },
      hasil_tes: {
        cek1_standar: cek1,
        cek2_dibersihkan: cek2,
        cek3_huruf_besar: cek3,
        cek4_tanpa_angka: cek4,
      },
      referensi_hash_baru: {
        hash: hashBaru,
        tes: cekHashBaru,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error_server: err.message, stack: err.stack });
  }
}
