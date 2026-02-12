'use client'

import axios from "@/lib/api/axios";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", { email });
      setMessage(res.data.message);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-orange-50 shadow-lg rounded-lg border border-orange-300">
  <h2 className="text-2xl font-bold mb-6 text-black text-center">Forgot Password</h2>

  {message && <p className="text-black bg-orange-200 px-3 py-2 rounded mb-4 text-center">{message}</p>}
  {error && <p className="text-black bg-orange-200 px-3 py-2 rounded mb-4 text-center">{error}</p>}

  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border border-orange-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
      required
    />

    <button
      type="submit"
      className="bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg transition-colors duration-200"
    >
      Send Reset Link
    </button>
  </form>
</div>

  );
}