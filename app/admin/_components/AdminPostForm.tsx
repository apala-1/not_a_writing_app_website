"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, Image as ImageIcon, FileText, Plus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Attachment { _id: string; type: "text" | "image"; value?: string; url?: string; }
interface Post { _id: string; title: string; content: string; attachments?: Attachment[]; }

export default function AdminPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(post.attachments || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:3000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      existingAttachments.forEach((att) => formData.append("existingAttachments", att._id));
      newFiles.forEach((file) => formData.append("attachments", file));

      const res = await fetch(`${BACKEND_URL}/api/v1/admin/posts/${post._id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Back Link */}
      <Link href="/admin/posts" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-6 group">
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all"><ArrowLeft size={18}/></div>
        <span className="font-bold">Back to Posts</span>
      </Link>

      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-8 text-white">
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="opacity-80 mt-1">Refine your message and update attachments</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Post Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-orange-400 focus:outline-none bg-gray-50/50 transition-all font-semibold text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Content Body</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-orange-400 focus:outline-none bg-gray-50/50 transition-all h-64 resize-none leading-relaxed" />
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ImageIcon size={20} className="text-orange-500"/> Media & Attachments</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {existingAttachments.map((att, idx) => (
                <div key={att._id} className="relative group bg-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden p-2">
                  {att.type === "image" ? (
                    <img src={`${BACKEND_URL}${att.url}`} className="w-full h-32 object-cover rounded-xl" alt="" />
                  ) : (
                    <div className="h-32 flex items-center justify-center bg-white rounded-xl text-gray-400"><FileText size={32}/></div>
                  )}
                  <button
                    type="button"
                    onClick={() => setExistingAttachments(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
              
              {/* Add More Slot */}
              <label className="border-2 border-dashed border-gray-200 rounded-2xl h-[148px] flex flex-col items-center justify-center text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all cursor-pointer group">
                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-orange-50 transition-all mb-2"><Plus size={24}/></div>
                <span className="text-sm font-bold">Add Media</span>
                <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files || []))} className="hidden" />
              </label>
            </div>
            {newFiles.length > 0 && <p className="text-sm text-orange-600 font-bold">+{newFiles.length} new files selected</p>}
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button type="button" onClick={() => router.back()} className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all">Discard Changes</button>
            <button type="submit" disabled={loading} className="flex-<sup>2</sup> py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
              {loading ? "Updating Post..." : "Save Post Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}