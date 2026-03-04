"use client";

import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/api/axios";

interface Post {
  _id: string;
  title: string;
  description: string;
  content: string;
  author?: { name: string };
  status: string;
  createdAt: string;
}

export default function AdminPostsTable({
  initialPosts,
  total,
  pageSize,
}: {
  initialPosts: Post[];
  total: number;
  pageSize: number;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [creating, setCreating] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  async function fetchPage(newPage: number) {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/api/v1/admin/posts?skip=${(newPage - 1) * pageSize}&limit=${pageSize}`
      );
      setPosts(data.data);
      setPage(newPage);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await axiosInstance.delete(`/api/v1/admin/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  }

 async function handleCreate(e: React.FormEvent) {
  e.preventDefault();
  setCreating(true);

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    files.forEach((f) => formData.append("attachments", f));

    // Log FormData for debugging
    console.log("FormData contents:");
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(key, value.name, value.size, value.type);
      } else {
        console.log(key, value);
      }
    });

    const { data } = await axiosInstance.post("/api/v1/admin/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setPosts((prev) => [data.data, ...prev]);
    setShowModal(false);
    setTitle("");
    setDescription("");
    setContent("");
    setFiles([]);
    alert("Post created!");
  } catch (err: any) {
    console.error("Axios Error:", err.response?.data || err.message);
    alert("Failed to create post: " + (err.response?.data?.message || err.message));
  } finally {
    setCreating(false);
  }
}

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Posts</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          New Post
        </button>
      </div>

      {/* Posts Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Author</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Created</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post._id}>
                <td className="px-6 py-4">{post.title}</td>
                <td className="px-6 py-4">{post.author?.name ?? "Unknown"}</td>
                <td className="px-6 py-4">{post.status}</td>
                <td className="px-6 py-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/posts/${post._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-4 text-center text-gray-500">Loading...</div>}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => fetchPage(pageNumber)}
              className={`px-3 py-1 rounded border ${
                pageNumber === page ? "bg-orange-500 text-white" : "bg-white"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Post</h3>
            <form onSubmit={handleCreate} className="space-y-4">
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
                <label className="block mb-1 font-medium">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border px-3 py-2 rounded h-32"
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
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}