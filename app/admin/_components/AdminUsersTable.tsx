// components/AdminUsersTable.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit2, Trash2, ChevronLeft, ChevronRight, User as UserIcon, Mail, Shield } from "lucide-react";

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

// Reuse the ConfirmModal from your profile page theme
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', loading = false
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminUsersTable({ initialUsers, total, page, size }: AdminUsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(page);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const totalPages = Math.ceil(total / size);
  const BACKEND_URL = "http://localhost:3000";

  async function fetchPage(p: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/users?page=${p}&size=${size}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.data);
      setCurrentPage(data.page);
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/${userToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchPage(currentPage);
        setShowDeleteModal(false);
      }
    } finally {
      setDeleteLoading(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-orange-50 to-rose-50 border-b border-orange-100">
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-sm font-bold text-orange-800 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm overflow-hidden bg-gradient-to-br from-orange-100 to-rose-100 flex-shrink-0">
                        {user.profilePicture ? (
                          <img
                            src={`${BACKEND_URL}/uploads/${user.profilePicture}`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-orange-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{user._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} className="text-orange-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      <Shield size={12} />
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setUserToDelete(user._id);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
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
      <div className="flex justify-center items-center gap-2 py-4">
        <button
          onClick={() => fetchPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 disabled:opacity-50 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                i + 1 === currentPage
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md scale-110"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 disabled:opacity-50 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete User?"
        message="Are you sure you want to remove this user? This action cannot be undone."
        confirmText="Yes, Delete"
        loading={deleteLoading}
      />
    </div>
  );
}