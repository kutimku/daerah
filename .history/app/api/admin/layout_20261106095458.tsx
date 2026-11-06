import { getUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.wajib_ganti_password) redirect("/admin/ganti-password");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar user={user} />
      <main className="flex-1 md:ml-64 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
