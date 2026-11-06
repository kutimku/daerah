import { getUser } from "@/lib/auth/get-user";

export default async function DashboardPage() {
  const user = await getUser();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Halo, {user?.nama} 👋</h1>
      <p className="text-gray-600">
        Anda login sebagai <strong>{user?.role}</strong>.
      </p>
      <div className="mt-6 bg-white border rounded-xl p-6 text-gray-500 text-sm">
        Dashboard lengkap akan dibuat pada tahap berikutnya.
      </div>
    </div>
  );
}
