// components/AdminUsersTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface AdminUsersTableProps {
  initialUsers: User[];
  total: number;
  page: number;
  size: number;
}

export default function AdminUsersTable({
  initialUsers,
  total,
  page,
  size,
}: AdminUsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(page);

  const totalPages = Math.ceil(total / size);

 const BACKEND_URL = "http://localhost:3000"; // backend port

async function fetchPage(p: number) {
  const res = await fetch(`${BACKEND_URL}/api/v1/users?page=${p}&size=${size}`, {
    credentials: "include", // send cookies if any
  });

  if (!res.ok) {
    alert("Failed to fetch page: " + res.status);
    return;
  }

  const data = await res.json();
  setUsers(data.data);
  setCurrentPage(data.page);
}


  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`${BACKEND_URL}/api/v1/users/${id}`, {
      method: "DELETE",
      credentials: "include",
}
);

    if (res.ok) {
      alert("User deleted!");
      fetchPage(currentPage); // refresh current page
    } else {
      alert("Failed to delete user");
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Profile</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
            <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 text-sm text-gray-600">{user._id}</td>
              <td className="px-6 py-4">
               <img
                src={user.profilePicture ? `${BACKEND_URL}/uploads/${user.profilePicture}` : "/default-picture.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
                />

              </td>
              <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <Link
                  href={`/admin/users/${user._id}/edit`}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </Link>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => fetchPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              i + 1 === currentPage
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => fetchPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
