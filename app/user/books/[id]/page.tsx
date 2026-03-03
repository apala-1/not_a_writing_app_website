"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/api/axios";

interface ChapterContent {
  type: "text" | "image";
  value: string; // For image: path returned from server
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
      const res = await axios.get("/api/v1/auth/me"); // your auth endpoint
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

  if (loading) return <div>Loading book...</div>;
  if (!book) return <div>Book not found</div>;

  if (loading || currentUserId === null) return <div>Loading...</div>;
const isAuthor = book.author._id === currentUserId;
console.log("Is Author:", isAuthor, "Current User ID:", currentUserId, "Book Author ID:", book.author._id);

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
        router.push("/"); // or /my-books
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
    const res = await axios.put(`/api/v1/book/${book._id}`, {
      chapters: chaptersCopy,
    });
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

  // Upload an image and return its server path
  const handleImageUpload = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleUpdateContentBlock(index, res.data.path); // path returned from server
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

       // Clean chapters payload to remove any extra fields like _id
const cleanedChapters = chaptersCopy.map(chapter => ({
  ...chapter,
  content: chapter.content.map(item => ({
    type: item.type,
    value: item.value,
  })),
}));

console.log("Cleaned Chapters payload:", JSON.stringify(cleanedChapters, null, 2));

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
    <div className="max-w-4xl mx-auto p-4">
      {book.coverPhotoUrl && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${book.coverPhotoUrl}`}
          alt={book.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-600 mb-4">by {book.author.name}</p>
      <p className="text-gray-800 mb-6">{book.description}</p>

      <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
      {book.chapters.length === 0 && <p>No chapters yet.</p>}

      {book.chapters.map((chapter, index) => (
        <div key={index} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
          {chapter.content.map((c, idx) =>
            c.type === "text" ? (
              <p key={idx} className="mb-2">{c.value}</p>
            ) : (
              <img
                key={idx}
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${c.value}`}
                alt={`Chapter ${index + 1} image`}
                className="mb-2 rounded-lg"
              />
            )
          )}
          {isAuthor && (
            <div className="mt-2 flex gap-2">
              <button
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => startEditingChapter(index)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDeleteChapter(index)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {isAuthor && (
        <div className="mt-8 p-4 border-t border-gray-300">
          <h3 className="text-xl font-semibold mb-2">
            {editingIndex !== null ? "Edit Chapter" : "Add Chapter"}
          </h3>
          <input
            type="text"
            placeholder="Chapter Title"
            className="w-full mb-2 p-2 border rounded"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />

          {/* Content Blocks */}
          {chapterContent.map((block, idx) => (
            <div key={idx} className="mb-2 flex gap-2 items-center">
              {block.type === "text" ? (
                <textarea
                  className="flex-1 p-2 border rounded"
                  rows={2}
                  value={block.value}
                  onChange={(e) => handleUpdateContentBlock(idx, e.target.value)}
                />
              ) : (
                <div className="flex-1 flex gap-2 items-center">
                  {block.value ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${block.value}`}
                      className="h-24 rounded"
                    />
                  ) : (
                    <p className="text-gray-500">No image yet</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0], idx);
                      }
                    }}
                  />
                </div>
              )}
              <button
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDeleteContentBlock(idx)}
              >
                X
              </button>
            </div>
          ))}

          <div className="flex gap-2 mb-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleAddContentBlock("text")}
            >
              + Text
            </button>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleAddContentBlock("image")}
            >
              + Image
            </button>
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSaveChapter}
            disabled={adding}
          >
            {adding ? "Saving..." : editingIndex !== null ? "Save Changes" : "Add Chapter"}
          </button>
        </div>
      )}
    </div>
  );
}