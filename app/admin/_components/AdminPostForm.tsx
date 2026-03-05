"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Attachment {
  _id: string;
  type: "text" | "image";
  value?: string;
  url?: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  attachments?: Attachment[];
}

export default function AdminPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(post.attachments || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // Keep IDs of existing attachments
      existingAttachments.forEach((att: Attachment) =>
        formData.append("existingAttachments", att._id)
      );

      // Append new files
      newFiles.forEach((file: File) => formData.append("attachments", file));

      const res = await fetch(`http://localhost:3000/api/v1/admin/posts/${post._id}`, {
        method: "PUT",
        credentials: "include", // include cookies
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Update failed: " + text);
        setLoading(false);
        return;
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err: any) {
      console.error("Update Error:", err);
      alert("Update failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Content */}
      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          className="w-full border px-3 py-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Existing Attachments */}
      {existingAttachments.length > 0 && (
        <div>
          <label className="block mb-1 font-medium">Existing Attachments</label>
          <div className="space-y-2">
            {existingAttachments.map((att: Attachment, idx: number) => (
              <div key={att._id} className="flex items-center gap-2 border p-2 rounded">
                {att.type === "text" ? (
                  <p>{att.value}</p>
                ) : (
                  <img
                    src={`http://localhost:3000${att.url}`}
                    alt="attachment"
                    className="w-24 h-auto rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={() =>
                    setExistingAttachments((prev: Attachment[]) =>
                      prev.filter((_, i: number) => i !== idx)
                    )
                  }
                  className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Attachments */}
      <div>
        <label className="block mb-1 font-medium">Add New Attachments</label>
        <input
          type="file"
          multiple
          onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
          className="block w-full text-sm text-gray-600"
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