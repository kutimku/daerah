import { getUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Sidebar from "@/components/Sidebar";

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar user={user} />
      {/* md:pl-64 agar konten tidak tertutup sidebar di desktop */}
      <main className="flex-1 md:pl-64 pt-4 md:pt-0 pb-20 md:pb-8 px-4 md:px-8 w-full">
        <div className="max-w-6xl mx-auto pt-4 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
