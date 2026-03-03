"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  description: string;
  coverPhotoUrl?: string;
  author: {
    name: string;
  };
}

export default function ExploreTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axios.get("/api/v1/book");
        setBooks(res.data.data);
      } catch (err) {
        console.error("Failed to fetch explore books", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) return <div>Loading books...</div>;

  return (
    <div className="max-w-6xl mx-auto max-w-9xl mx-auto min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-8 relative overflow-hidden p-10">
      <h1 className="text-3xl font-bold mb-8 text-orange-600">Explore Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => router.push(`/user/books/${book._id}`)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
          >
            {book.coverPhotoUrl && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${book.coverPhotoUrl}`}
                className="h-48 w-full object-cover"
                alt={book.title}
              />
            )}

            <div className="p-4">
              <h2 className="font-bold text-lg text-orange-600">{book.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                by {book.author.name}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {book.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}