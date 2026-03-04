// app/admin/posts/page.tsx
import Header from "@/app/(public)/_components/Header";
import AdminPostsTable from "../_components/AdminPostsTable";
import { cookies } from "next/headers";

async function fetchPosts(page = 1, size = 10) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) throw new Error("No access token found");

  const res = await fetch(
    `http://localhost:3000/api/v1/admin/posts?skip=${(page - 1) * size}&limit=${size}`,
    {
      headers: { cookie: `accessToken=${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch posts");

  return res.json();
}

export default async function AdminPostsPage() {
  const { data, total } = await fetchPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Posts</h1>

        {/* Pass server-fetched data to client */}
        <AdminPostsTable initialPosts={data} total={total} pageSize={10} />
      </main>
    </div>
  );
}