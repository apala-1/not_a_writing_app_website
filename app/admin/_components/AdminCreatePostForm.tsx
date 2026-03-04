"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axios";

export default function AdminCreatePostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // append files
      files.forEach((file) => formData.append("attachments", file));

      const { data } = await axiosInstance.post(
        "/api/v1/admin/posts",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Post created!");
      router.push("/admin/posts"); // redirect to posts table
    } catch (err: any) {
      console.error(err);
      alert("Failed to create post: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-3 py-2 rounded h-40"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Attachments</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="block w-full text-sm text-gray-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}