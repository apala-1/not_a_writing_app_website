"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPostForm({ post }: { post: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`http://localhost:3000/api/v1/admin/posts/${post._id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // <--- include cookies in request
  body: JSON.stringify({ title, content }),
});

    setLoading(false);

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow"
    >
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          className="w-full border px-3 py-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        {loading ? "Updating..." : "Update Post"}
      </button>
    </form>
  );
}