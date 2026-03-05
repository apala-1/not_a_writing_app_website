// app/admin/books/page.tsx
import AdminBooksTable from "../_components/AdminBooksTable";
import AdminHeader from "../_components/AdminHeader";
import { cookies } from "next/headers";

async function fetchBooks(page = 1, size = 10) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) throw new Error("No access token found");

  const res = await fetch(
    `http://localhost:3000/api/v1/admin/books?skip=${(page - 1) * size}&limit=${size}`,
    {
      headers: { cookie: `accessToken=${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch books");

  return res.json();
}

export default async function AdminBooksPage() {
  const { data, total } = await fetchBooks();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Books</h1>
        <AdminBooksTable initialBooks={data} total={total} pageSize={10} />
      </main>
    </div>
  );
}