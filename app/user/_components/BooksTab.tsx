"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  description: string;
  coverPhotoUrl?: string;
  createdAt: string;
}

export default function BooksTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await axios.get("/api/v1/book/my-books");
        setBooks(res.data.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) return <div>Loading your books...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Books</h1>

      {books.length === 0 ? (
        <div className="text-center py-12">
          You haven't created any books yet.
        </div>
      ) : (
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
                <h2 className="font-bold text-lg">{book.title}</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {book.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}