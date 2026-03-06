// app/admin/users/page.tsx

import AdminUsersTable from "../_components/AdminUsersTable";
import { cookies } from "next/headers";
import AdminHeader from "../_components/AdminHeader";
import { UserPlus } from "lucide-react";
import Link from "next/link";

async function fetchUsers(page = 1, size = 10) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`http://localhost:3000/api/v1/users?page=${page}&size=${size}`, {
    headers: { cookie: `accessToken=${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function AdminUsersPage() {
  const { data, total, page, size } = await fetchUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              User <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">Management</span>
            </h1>
            <p className="text-gray-500 mt-2">Manage your community members and their permissions</p>
          </div>
          
          <Link href="/admin/users/create">
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
              <UserPlus size={20} />
              Create New User
            </button>
          </Link>
        </div>

        <AdminUsersTable
          initialUsers={data}
          total={total}
          page={page}
          size={size}
        />
      </main>

    </div>
  );
}