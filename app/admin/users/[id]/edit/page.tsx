"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

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
  const [file, setFile] = useState<File | null>(null);

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

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  // Handle update
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value);
    formData.append("email", (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value);
    formData.append("role", (e.currentTarget.elements.namedItem("role") as HTMLSelectElement).value);
    if (file) formData.append("profilePicture", file);

    const res = await fetch(`${BACKEND_URL}/api/v1/users/${user?._id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      alert("User updated!");
      router.push("/admin/users");
    } else {
      alert("Failed to update user");
    }
  }

  return (
  <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10">
    <div className="max-w-md w-full p-6 bg-white shadow-lg rounded">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Edit User: {user.name}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Role</label>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {user.profilePicture && (
            <img
              src={`${BACKEND_URL}/uploads/${user.profilePicture}`}
              alt="Profile"
              className="w-24 h-24 rounded-full mt-3 border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
);
}
