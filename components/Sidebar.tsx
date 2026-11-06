"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { SessionPayload } from "@/lib/auth/session";

export default function Sidebar({ user }: { user: SessionPayload }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Data Jamaah", href: "/admin/jamaah", icon: "👥" },
    { name: "Data Keluarga", href: "/admin/keluarga", icon: "👨‍👩‍👧‍👦" },
    { name: "Verifikasi Pendaftaran", href: "/admin/verifikasi", icon: "📝" },
    { name: "Jadwal Kegiatan", href: "/admin/kegiatan", icon: "📅" },
    { name: "Absensi", href: "/admin/absensi", icon: "✅" },
  ];

  async function handleLogout() {
    if (!confirm("Yakin ingin keluar?")) return;
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Header Mobile (Hanya tampil di HP) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b p-4 sticky top-0 z-50 shadow-sm">
        <div className="font-bold text-primary-700">Pengajian KT</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 p-2"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Konten */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-6 border-b hidden md:block">
          <h1 className="font-bold text-primary-700 text-lg">
            Pengajian Kutai Timur
          </h1>
          <p className="text-xs text-gray-500 mt-1">Sistem Informasi Jamaah</p>
        </div>

        <div className="p-6 bg-gray-50 border-b">
          <p className="font-semibold text-gray-800">{user.nama}</p>
          <p className="text-xs text-gray-500 capitalize">Role: {user.role}</p>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === menu.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{menu.icon}</span>
              {menu.name}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors"
            >
              <span>🚪</span> Keluar
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
