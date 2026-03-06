"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Camera, User as UserIcon, Mail, Shield, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const BACKEND_URL = "http://localhost:3000";

  // Fetch user
  useEffect(() => {
    if (!id) return;
    async function fetchUser() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/users/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  // Handle image preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    formData.append("name", (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("email", (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value);
    formData.append("role", (e.currentTarget.elements.namedItem("role") as HTMLSelectElement).value);
    if (file) formData.append("profilePicture", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/${user?._id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        router.push("/admin/users");
      } else {
        alert("Failed to update user");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium">Fetching user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <UserIcon className="text-red-600" />
          </div>
          <p className="text-red-600 text-lg font-bold">User not found</p>
          <Link href="/admin/users" className="mt-4 text-orange-500 hover:underline inline-block">Back to Users</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-12 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          href="/admin/users" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="font-semibold">Back to User Management</span>
        </Link>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-8 text-white">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="opacity-80 mt-1">Updating account details for {user.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Profile Picture Upload Area */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-gray-100">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : user.profilePicture ? (
                    <img src={`${BACKEND_URL}/uploads/${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserIcon size={48} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full shadow-lg cursor-pointer hover:bg-orange-600 transition-all hover:scale-110">
                  <Camera size={20} />
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <p className="text-sm text-gray-500 font-medium">Click the camera to update photo</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <UserIcon size={16} className="text-orange-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  placeholder="e.g. John Doe"
                  className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-orange-500" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  placeholder="john@example.com"
                  className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Shield size={16} className="text-orange-500" /> Account Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white appearance-none transition-all"
                  >
                    <option value="user">Community Member (User)</option>
                    <option value="admin">System Administrator (Admin)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-<sup>2</sup> px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}