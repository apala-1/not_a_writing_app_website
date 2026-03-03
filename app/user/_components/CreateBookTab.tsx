"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface TextAttachment {
  type: "text";
  value: string;
}

interface ImageAttachment {
  type: "image";
  url: string;
}

interface Post {
  _id: string;
  title: string;
  body?: string;
  attachments?: (TextAttachment | ImageAttachment)[];
}

export default function CreateBookTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const router = useRouter();

  // Fetch user's posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get("/api/v1/post/my-posts");
        setPosts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    }
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);

      const chapters = posts
  .filter(post => selectedPostIds.includes(post._id))
  .map(post => ({
    title: post.title || "Untitled",
    content:
      post.attachments && post.attachments.length > 0
        ? post.attachments.map(att => ({
            type: att.type,
            value: att.type === "image" ? (att as ImageAttachment).url : (att as TextAttachment).value
          }))
        : [{ type: "text", value: post.body || "" }]
  }));

        const cleanedChapters = chapters.map(ch => ({
  ...ch,
  content: ch.content.filter(block => block.value.trim() !== "")
})).filter(ch => ch.content.length > 0);

console.log("Chapters before cleaning:", chapters);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("chapters", JSON.stringify(chapters));
console.log("Cover image file:", coverImage);
      if (coverImage) {
        formData.append("coverPhoto", coverImage);
      }

     const res = await axios.post("/api/v1/book", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
      router.push(`/user/books/${res.data.data._id}`);
    } catch (err) {
  if (err instanceof AxiosError) {
    console.error("Server response:", err.response?.data);
  } else {
    console.error("Unknown error:", err);
  }
}finally {
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
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => e.target.files && setCoverImage(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Select Posts for Chapters</label>
          <select
            multiple
            value={selectedPostIds}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              setSelectedPostIds(selected);
            }}
            className="w-full border rounded-lg px-4 py-2 h-48"
          >
            {posts.map(post => (
              <option key={post._id} value={post._id}>
                {post.title || "Untitled"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Hold Ctrl (or Cmd) to select multiple posts.
          </p>
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