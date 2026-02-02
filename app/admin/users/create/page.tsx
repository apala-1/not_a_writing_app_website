"use client";

import { useRef, useState } from "react";

export default function CreateUserPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    // Append the file manually
    if (file) formData.set("profilePicture", file);

    try {
      const res = await fetch("http://localhost:3000/api/v1/users/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json(); // parse JSON after response

      if (!res.ok) {
        console.error("Error creating user:", data);
        alert(data.message || "Failed to create user");
        return;
      }

      alert("User created successfully!");
      formRef.current.reset();
      setFile(null);
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Check console.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-orange-50 rounded-lg shadow-md border border-orange-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
        Create New User
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium text-orange-700">Full Name</label>
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full border border-orange-300 rounded px-3 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-orange-700">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border border-orange-300 text-gray-800 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-orange-700">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full border border-orange-300 text-gray-800 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-orange-700">Role</label>
          <select
            name="role"
            required
            className="w-full border border-orange-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            defaultValue=""
          >
            <option value="" disabled className="text-gray-500">
              Select role
            </option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-orange-700">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition-colors"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
