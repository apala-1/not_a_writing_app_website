"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Calendar, User as UserIcon, Book as BookIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface Book { _id: string; title: string; author: { name: string } | string; createdAt: string; }

export default function AdminBooksTable({ initialBooks, total, pageSize }: { initialBooks: Book[]; total: number; pageSize: number; }) {
  const router = useRouter();
  const [books, setBooks] = useState(initialBooks);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(total / pageSize);
  const BACKEND_URL = "http://localhost:3000";

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this book?")) return;
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/books/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setBooks(books.filter((b) => b._id !== id));
  }

  async function goToPage(page: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/books?skip=${(page - 1) * pageSize}&limit=${pageSize}`, { credentials: "include" });
    if (res.ok) {
      const json = await res.json();
      setBooks(json.data);
      setCurrentPage(page);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-orange-50 to-rose-50 border-b border-orange-100">
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider">Book Title</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {books.map((book) => (
                <tr key={book._id} className="group hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <BookIcon size={20}/>
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{book.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                      <UserIcon size={16} className="text-orange-400" />
                      {typeof book.author === "string" ? book.author : book.author.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-400" />
                      {new Date(book.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* <button 
                        onClick={() => router.push(`/admin/books/${book._id}`)}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                      >
                        <Edit2 size={16}/>
                      </button> */}
                      <button 
                        onClick={() => handleDelete(book._id)}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border hover:bg-orange-50 disabled:opacity-50 transition-all"><ChevronLeft size={20}/></button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  currentPage === i + 1 
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md scale-110" 
                    : "bg-white text-gray-700 border hover:border-orange-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white border hover:bg-orange-50 disabled:opacity-50 transition-all"><ChevronRight size={20}/></button>
        </div>
      )}
    </div>
  );
}