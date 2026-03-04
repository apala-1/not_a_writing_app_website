"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "@/lib/api/axios";
import axiosInstance from "@/lib/api/axios";

interface Post {
  _id: string;
  title: string;
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

  return (
    <>
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
    </>
  );
}