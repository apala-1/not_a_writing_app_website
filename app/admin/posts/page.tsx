import AdminHeader from "../_components/AdminHeader";
import AdminPostsTable from "../_components/AdminPostsTable";
import { cookies } from "next/headers";

async function fetchPosts(page = 1, size = 10) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) throw new Error("No access token found");

  const res = await fetch(`http://localhost:3000/api/v1/admin/posts?skip=${(page - 1) * size}&limit=${size}`, {
    headers: { cookie: `accessToken=${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function AdminPostsPage() {
  const { data, total } = await fetchPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-10 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">Archive</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Curate, edit, and manage your community's shared stories.</p>
        </div>

        <AdminPostsTable initialPosts={data} total={total} pageSize={10} />
      </main>

    </div>
  );
}