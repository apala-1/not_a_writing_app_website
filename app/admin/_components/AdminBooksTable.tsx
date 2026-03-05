"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  author: { name: string } | string;
  createdAt: string;
}

interface Props {
  initialBooks: Book[];
  total: number;
  pageSize: number;
}

export default function AdminBooksTable({ initialBooks, total, pageSize }: Props) {
  const router = useRouter();
  const [books, setBooks] = useState(initialBooks);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(total / pageSize);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this book?")) return;

    const res = await fetch(`http://localhost:3000/api/v1/admin/books/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    setBooks(books.filter((b) => b._id !== id));
  }

  async function goToPage(page: number) {
    const res = await fetch(
      `http://localhost:3000/api/v1/admin/books?skip=${(page - 1) * pageSize}&limit=${pageSize}`,
      { credentials: "include" }
    );

    if (!res.ok) {
      alert("Failed to fetch books");
      return;
    }

    const json = await res.json();
    setBooks(json.data);
    setCurrentPage(page);
  }

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Author</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created At</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book._id}>
              <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {typeof book.author === "string" ? book.author : book.author.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(book.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => router.push(`/admin/books/${book._id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-orange-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}