// app/admin/posts/[id]/page.tsx
import Header from "@/app/(public)/_components/Header";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AdminPostForm from "../../_components/AdminPostForm";

async function fetchPost(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  console.log("Server Fetch post token: ", token);

  if (!token) throw new Error("No access token found");
  if (!id) throw new Error("No post ID provided");

  const res = await fetch(`http://localhost:3000/api/v1/admin/posts/${id}`, {
    headers: {
      cookie: `accessToken=${token}`, // send token manually server-side
    },
    cache: "no-store",
  });

  console.log("Server Fetch post response:", res);

  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch post:", text);
    throw new Error("Failed to fetch post");
  }

  const json = await res.json();
  return json.data;
}

export default async function AdminUpdatePostPage({ params }: { params: any }) {
  const unwrappedParams = await params; // <-- unwrap
  const id = unwrappedParams.id;

  if (!id) return notFound();

  const post = await fetchPost(id);

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Update Post</h1>
        <AdminPostForm post={post} />
      </main>
    </div>
  );
}