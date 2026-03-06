import AdminBooksTable from "../_components/AdminBooksTable";
import AdminHeader from "../_components/AdminHeader";
import { cookies } from "next/headers";
import { Library } from "lucide-react";

async function fetchBooks(page = 1, size = 10) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) throw new Error("No access token found");

  const res = await fetch(`http://localhost:3000/api/v1/admin/books?skip=${(page - 1) * size}&limit=${size}`, {
    headers: { cookie: `accessToken=${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export default async function AdminBooksPage() {
  const { data, total } = await fetchBooks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500"><Library size={32}/></div>
            Library <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">Manager</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Organize and publish books and educational resources for the community.</p>
        </div>

        <AdminBooksTable initialBooks={data} total={total} pageSize={10} />
      </main>
    </div>
  );
}
