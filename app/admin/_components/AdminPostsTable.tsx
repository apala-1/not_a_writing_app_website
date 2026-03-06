"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Calendar, User as UserIcon, Eye, X, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/api/axios";

interface Post {
  _id: string;
  title: string;
  description: string;
  content: string;
  attachments?: { _id: string; type: "text" | "image"; value?: string; url?: string }[];
  author?: { name: string };
  status: string;
  createdAt: string;
}

export default function AdminPostsTable({ initialPosts, total, pageSize }: { initialPosts: Post[]; total: number; pageSize: number; }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [creating, setCreating] = useState(false);

  const totalPages = Math.ceil(total / pageSize);
  const BACKEND_URL = "http://localhost:3000";

  async function fetchPage(newPage: number) {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/v1/admin/posts?skip=${(newPage - 1) * pageSize}&limit=${pageSize}`);
      setPosts(data.data);
      setPage(newPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Delete this post?")) return;
    try {
      await axiosInstance.delete(`/api/v1/admin/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
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

      const { data } = await axiosInstance.post("/api/v1/admin/posts", formData);
      setPosts((prev) => [data.data, ...prev]);
      setShowCreateModal(false);
      resetForm();
    } finally {
      setCreating(false);
    }
  }

  const resetForm = () => {
    setTitle(""); setDescription(""); setContent(""); setFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Table Header Action */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-orange-50 to-rose-50 border-b border-orange-100">
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase">Title & Author</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="group hover:bg-orange-50/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{post.title}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <UserIcon size={12} /> {post.author?.name ?? "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar size={14} className="text-orange-400" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white border border-gray-200 rounded-lg text-orange-500 hover:bg-orange-50"><Eye size={16} /></button>
                      <Link href={`/admin/posts/${post._id}`} onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50"><Edit2 size={16} /></button>
                      </Link>
                      <button onClick={(e) => handleDelete(e, post._id)} className="p-2 bg-white border border-gray-200 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button onClick={() => fetchPage(page - 1)} disabled={page === 1} className="p-2 rounded-xl bg-white border hover:bg-orange-50 disabled:opacity-50"><ChevronLeft size={20}/></button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i+1}
            onClick={() => fetchPage(i+1)}
            className={`w-10 h-10 rounded-xl font-bold transition-all ${
              i+1 === page ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md scale-110" : "bg-white text-gray-600 border hover:border-orange-300"
            }`}
          >
            {i+1}
          </button>
        ))}
        <button onClick={() => fetchPage(page + 1)} disabled={page === totalPages} className="p-2 rounded-xl bg-white border hover:bg-orange-50 disabled:opacity-50"><ChevronRight size={20}/></button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-scale-in p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h3>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-orange-400 focus:outline-none bg-gray-50" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Short Description</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-orange-400 focus:outline-none bg-gray-50" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-orange-400 focus:outline-none bg-gray-50 h-32" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Attachments</label>
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={creating} className="flex-<sup>2</sup> py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 disabled:opacity-70 flex items-center justify-center gap-2">
                  {creating ? <Loader2 className="animate-spin"/> : <Plus size={20}/>}
                  {creating ? "Creating..." : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedPost(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto animate-scale-in">
            <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10"><X size={20}/></button>
            <div className="bg-gradient-to-r from-orange-50 to-rose-50 p-8 border-b border-orange-100">
              <h2 className="text-3xl font-bold text-gray-900 pr-10">{selectedPost.title}</h2>
              <div className="flex items-center gap-4 mt-4 text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><UserIcon size={16} className="text-orange-500"/> {selectedPost.author?.name}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-orange-500"/> {new Date(selectedPost.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
                <p className="text-orange-800 font-medium italic">"{selectedPost.description}"</p>
              </div>
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</div>
              {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-orange-500"/> Attachments</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.attachments.map((att, idx) => (
                      <div key={idx} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-2">
                        {att.type === "image" ? (
                          <img src={`${BACKEND_URL}${att.url}`} alt="attachment" className="w-full h-48 object-cover rounded-xl transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="h-48 flex items-center justify-center text-gray-400 bg-white rounded-xl"><FileText size={48}/></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}