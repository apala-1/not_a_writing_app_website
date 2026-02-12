"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/api/axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams(); // ✅ Next.js hook
  const router = useRouter();             // ✅ Next.js router for navigation

  const token = searchParams.get("token"); // get token from query

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/api/v1/auth/reset-password", {
        token,
        password,
      });
      setMessage(res.data.message);
      setError("");
      setTimeout(() => router.push("/login"), 2000); // redirect after success
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-orange-50 shadow-lg rounded-lg border border-orange-300">
  <h2 className="text-2xl font-bold mb-6 text-black text-center">Reset Password</h2>

  {message && <p className="text-black bg-orange-200 px-3 py-2 rounded mb-4 text-center">{message}</p>}
  {error && <p className="text-black bg-orange-200 px-3 py-2 rounded mb-4 text-center">{error}</p>}

  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
      type="password"
      placeholder="New Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="border border-orange-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
      required
    />

    <input
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="border border-orange-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
      required
    />

    <button
      type="submit"
      className="bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg transition-colors duration-200"
    >
      Reset Password
    </button>
  </form>
</div>
  );
}
