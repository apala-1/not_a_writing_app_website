"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/api/axios";

// Interfaces
interface ChapterContent {
  type: "text" | "image";
  value: string;
}

interface Chapter {
  title: string;
  content: ChapterContent[];
}

interface Book {
  _id: string;
  title: string;
  description: string;
  coverPhotoUrl: string;
  author: {
    name: string;
    _id: string;
  };
  chapters: Chapter[];
  noOfChapters: number;
  noOfPages: number;
}

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState<ChapterContent[]>([]);
  const [adding, setAdding] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/v1/auth/me");
        if (res.data.success) {
          setCurrentUserId(res.data.data._id);
        }
      } catch (err) {
        console.error("Failed to get current user", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await axios.get(`/api/v1/book/${params.id}`);
        setBook(res.data.data);
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [params.id, router]);

  if (loading || currentUserId === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Loading book details...</p>
        </div>
        <style jsx global>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </div>
    );
  }

  if (!book) return <div className="text-center text-gray-600 mt-20">Book not found</div>;

  const isAuthor = book.author._id === currentUserId;

  // Chapter CRUD
  const startEditingChapter = (index: number) => {
    const chapter = book.chapters[index];
    setEditingIndex(index);
    setChapterTitle(chapter.title);
    setChapterContent([...chapter.content]);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDeleteChapter = async (index: number) => {
    if (book.chapters.length === 1) {
      const confirmDeleteBook = confirm(
        "A book must have at least one chapter.\n\nDo you want to delete the entire book instead?"
      );
      if (confirmDeleteBook) {
        try {
          await axios.delete(`/api/v1/book/${book._id}`);
          router.push("/");
        } catch (err) {
          console.error(err);
        }
      }
      return;
    }
    if (!confirm("Delete this chapter?")) return;
    try {
      const chaptersCopy = [...book.chapters];
      chaptersCopy.splice(index, 1);
      const res = await axios.put(`/api/v1/book/${book._id}`, { chapters: chaptersCopy });
      setBook(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddContentBlock = (type: "text" | "image") => {
    setChapterContent([...chapterContent, { type, value: "" }]);
  };

  const handleUpdateContentBlock = (index: number, value: string) => {
    const copy = [...chapterContent];
    copy[index].value = value;
    setChapterContent(copy);
  };

  const handleDeleteContentBlock = (index: number) => {
    const copy = [...chapterContent];
    copy.splice(index, 1);
    setChapterContent(copy);
  };

  const handleImageUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleUpdateContentBlock(index, res.data.path);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleSaveChapter = async () => {
    if (!chapterTitle || chapterContent.length === 0) return;
    setAdding(true);
    try {
      const chaptersCopy = [...book.chapters];
      const newChapter: Chapter = { title: chapterTitle, content: chapterContent };

      if (editingIndex !== null) {
        chaptersCopy[editingIndex] = newChapter;
      } else {
        chaptersCopy.push(newChapter);
      }

      const cleanedChapters = chaptersCopy.map((chapter) => ({
        ...chapter,
        content: chapter.content.map((item) => ({
          type: item.type,
          value: item.value,
        })),
      }));

      const res = await axios.put(`/api/v1/book/${book._id}`, { chapters: cleanedChapters });
      setBook(res.data.data);
      setChapterTitle("");
      setChapterContent([]);
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-12 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 group shadow-sm"
        >
          <span className="text-lg transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="text-sm font-medium">Back to Library</span>
        </button>

        {/* Book Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden mb-8">
          {book.coverPhotoUrl && (
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${book.coverPhotoUrl}`}
                alt={book.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">{book.title}</h1>
                <p className="text-orange-100 text-lg font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  by {book.author.name}
                </p>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 font-medium">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                {book.noOfChapters} Chapters
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                {book.noOfPages} Pages
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8 border-l-4 border-orange-400 pl-4 italic">
              {book.description}
            </p>
            

            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Table of Contents
                </h2>
                {isAuthor && (
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setChapterTitle("");
                      setChapterContent([]);
                      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Chapter
                  </button>
                )}
              </div>

              {book.chapters.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No chapters yet. Start writing!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {book.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                          <span className="text-orange-500 mr-2">#{index + 1}</span>
                          {chapter.title}
                        </h3>
                        {isAuthor && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                              onClick={() => startEditingChapter(index)}
                              title="Edit Chapter"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                              onClick={() => handleDeleteChapter(index)}
                              title="Delete Chapter"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 text-gray-700 leading-relaxed">
                        {chapter.content.map((c, idx) =>
                          c.type === "text" ? (
                            <p key={idx} className="whitespace-pre-wrap">{c.value}</p>
                          ) : (
                            <div key={idx} className="rounded-xl overflow-hidden shadow-md border border-gray-100">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${c.value}`}
                                alt={`Chapter ${index + 1} image`}
                                className="w-full h-auto max-h-96 object-cover"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Section */}
        {isAuthor && (
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {editingIndex !== null ? "Edit Chapter" : "Create New Chapter"}
              </h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Chapter Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., The Beginning of the Journey"
                  className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 hover:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Content Blocks
                </label>

                {chapterContent.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                    No content added yet. Use the buttons below to add text or images.
                  </div>
                )}

                {chapterContent.map((block, idx) => (
                  <div key={idx} className="relative group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        onClick={() => handleDeleteContentBlock(idx)}
                        title="Remove Block"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {block.type === "text" ? (
                      <textarea
                        className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 resize-none"
                        rows={3}
                        placeholder="Write your story here..."
                        value={block.value}
                        onChange={(e) => handleUpdateContentBlock(idx, e.target.value)}
                      />
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                          {block.value ? (
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 group/img">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${block.value}`}
                                className="w-full h-48 object-cover"
                                alt="Content"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer bg-white/90 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                  Replace Image
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleImageUpload(e.target.files[0], idx);
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50/50 hover:bg-orange-50 cursor-pointer transition-colors">
                              <svg className="w-10 h-10 text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm text-orange-600 font-medium">Click to upload image</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageUpload(e.target.files[0], idx);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-200 text-orange-600 rounded-xl font-medium hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                    onClick={() => handleAddContentBlock("text")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Add Text
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-rose-200 text-rose-600 rounded-xl font-medium hover:bg-rose-50 hover:border-rose-300 transition-all duration-200"
                    onClick={() => handleAddContentBlock("image")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add Image
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button
                  className="flex-1 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                  onClick={handleSaveChapter}
                  disabled={adding || !chapterTitle || chapterContent.length === 0}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {adding ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Chapter...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingIndex !== null ? "Save Changes" : "Publish Chapter"}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>

                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      setChapterTitle("");
                      setChapterContent([]);
                    }}
                    className="sm:flex-none px-8 py-4 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-bold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
