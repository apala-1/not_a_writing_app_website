"use client";

import React, { useState } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";

export default function CreateBookTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (coverImage) {
        formData.append("coverPhoto", coverImage);
      }

      const res = await axios.post("/api/v1/book", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/user/books/${res.data.data._id}`);
    } catch (err) {
      console.error("Failed to create book", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Book</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setCoverImage(e.target.files[0]);
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Book"}
        </button>
      </form>
    </div>
  );
}