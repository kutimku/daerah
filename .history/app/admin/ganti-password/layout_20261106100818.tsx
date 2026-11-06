// app/admin/layout.tsx (versi yang sudah disesuaikan)
import { getUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  const pathname = headers().get("x-pathname") || "";
  if (
    user.wajib_ganti_password &&
    !pathname.startsWith("/admin/ganti-password")
  ) {
    redirect("/admin/ganti-password");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="hidden md:flex w-64 bg-white border-r fixed h-full p-4">
        <div className="text-sm text-gray-400">
          SIDEBAR (dibuat di tahap berikutnya)
        </div>
      </aside>
      <main className="flex-1 md:ml-64 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
