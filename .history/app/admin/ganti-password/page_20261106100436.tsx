"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GantiPasswordPage() {
  const router = useRouter();
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (passwordBaru !== konfirmasi) {
      setError("Konfirmasi password tidak sama");
      return;
    }
    if (passwordBaru.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/ganti-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordLama, passwordBaru }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengganti password");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-primary-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-xl font-bold text-primary-700 mb-2">
          Ganti Password
        </h1>
        <p className="text-sm text-gray-500 mb-5">
          Demi keamanan, Anda wajib mengganti password sebelum melanjutkan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Password Lama (kosongkan jika login pertama)</label>
            <input
              type="password"
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label>Password Baru (minimal 6 karakter)</label>
            <input
              type="password"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label>Konfirmasi Password Baru</label>
            <input
              type="password"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg py-2.5 transition"
          >
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      </div>
    </div>
  );
}
