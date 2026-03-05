"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { 
  BookPlus, 
  Image as ImageIcon, 
  Type, 
  CheckCircle2, 
  Circle, 
  Upload, 
  X,
  Loader2,
  FileText
} from "lucide-react";

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
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
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

  // Handle image preview
  useEffect(() => {
    if (!coverImage) {
      setCoverPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(coverImage);
    setCoverPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImage]);

  const togglePostSelection = (id: string) => {
    setSelectedPostIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim() || selectedPostIds.length === 0) return;

  try {
    setLoading(true);

    const chapters = posts
      .filter(post => selectedPostIds.includes(post._id))
      .map(post => {
        console.log("Processing post:", post._id, post.title); // log post

        const contentItems: { type: "text" | "image"; value: string }[] = [];

        if (post.body && post.body.trim()) {
          console.log("Adding body text:", post.body);
          contentItems.push({ type: "text", value: post.body.trim() });
        }

        if (post.attachments && post.attachments.length > 0) {
          post.attachments.forEach(att => {
            if (att.type === "image" && (att as ImageAttachment).url?.trim()) {
              console.log("Adding image attachment:", (att as ImageAttachment).url);
              contentItems.push({ type: "image", value: (att as ImageAttachment).url });
            } else {
              console.log("Skipping attachment:", att);
            }
          });
        }

        if (contentItems.length === 0) {
          console.log("No content found for post, adding fallback");
          contentItems.push({ type: "text", value: "No content provided" });
        }

        console.log("Final content items for this chapter:", contentItems);

        return {
          title: post.title || "Untitled Post",
          content: contentItems,
        };
      });

    console.log("All chapters ready to send:", JSON.stringify(chapters, null, 2));

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("chapters", JSON.stringify(chapters));

    if (coverImage) {
      console.log("Adding cover image:", coverImage.name);
      formData.append("coverPhoto", coverImage);
    }

    const res = await axios.post("/api/v1/book", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Book created successfully:", res.data);
    router.push(`/user/books/${res.data.data._id}`);
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error("Server response:", err.response?.data);
      alert(err.response?.data?.message || "Failed to create book");
    } else {
      console.error("Unknown error:", err);
      alert("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="max-w-4xl mx-auto pb-20 max-w-9xl mx-auto min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-8 relative overflow-hidden p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-2xl">
          <BookPlus className="text-orange-600" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Your Masterpiece</h1>
          <p className="text-slate-500 text-sm">Combine your thoughts and posts into a beautiful digital book.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Book Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="The Chronicles of..."
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none text-lg font-medium placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Synopsis</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is your book about?"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none min-h-[160px] resize-none placeholder:text-slate-400"
              />
            </div>
          </section>

          {/* Chapter Selection Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Chapters</h3>
                <p className="text-sm text-slate-500">Pick the posts you want to include as chapters</p>
              </div>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                {selectedPostIds.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {posts.length > 0 ? (
                posts.map(post => {
                  const isSelected = selectedPostIds.includes(post._id);
                  return (
                    <button
                      key={post._id}
                      type="button"
                      onClick={() => togglePostSelection(post._id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${
                        isSelected 
                          ? "border-orange-500 bg-orange-50/50" 
                          : "border-slate-100 hover:border-orange-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`transition-colors ${isSelected ? "text-orange-500" : "text-slate-300 group-hover:text-slate-400"}`}>
                        {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${isSelected ? "text-orange-900" : "text-slate-700"}`}>
                          {post.title || "Untitled Post"}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {post.body ? "Body text" : "Attachments only"}
                          </span>
                          {post.attachments && post.attachments.length > 0 && (
                            <span className="flex items-center gap-1 bg-slate-200/50 px-2 py-0.5 rounded">
                              <ImageIcon size={12} />
                              {post.attachments.length} media
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400">No posts found. Start by creating some posts!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Preview & Action */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Book Cover</h3>
            
            <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 group">
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={(e) => { e.preventDefault(); setCoverImage(null); }}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-200/50 transition-colors">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-3 text-orange-500 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Upload Cover</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => e.target.files && setCoverImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Chapters:</span>
                <span className="font-bold text-slate-900">{selectedPostIds.length}</span>
              </div>
              <div className="h-px bg-slate-100" />
              
              <button
                type="submit"
                disabled={loading || !title.trim() || selectedPostIds.length === 0}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish Book</span>
                )}
              </button>
              
              {selectedPostIds.length === 0 && !loading && (
                <p className="text-[10px] text-center text-rose-500 font-medium italic">
                  Select at least one chapter to publish
                </p>
              )}
            </div>
          </section>
        </div>
      </form>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
