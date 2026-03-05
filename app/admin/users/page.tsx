// app/admin/users/page.tsx
import Header from "@/app/(public)/_components/Header";
import AdminUsersTable from "../_components/AdminUsersTable";
import { cookies } from "next/headers";
import AdminHeader from "../_components/AdminHeader";

async function fetchUsers(page = 1, size = 10) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `http://localhost:3000/api/v1/users?page=${page}&size=${size}`,
    {
      headers: { cookie: `accessToken=${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json(); // { data: [...], total, page, size }
}

export default async function AdminUsersPage() {
  const { data, total, page, size } = await fetchUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <a
            href="/admin/users/create"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Create User
          </a>
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
