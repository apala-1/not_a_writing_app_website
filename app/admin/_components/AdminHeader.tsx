// app/admin/_components/AdminHeader.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // remove token or cookie
    document.cookie = "accessToken=; Max-Age=0; path=/";
    router.push("/login"); // redirect to login
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo + Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/admin/users")}>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">NA</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Not A Writing App</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link href="/admin/users" className="text-gray-700 font-medium hover:text-orange-600 transition-colors">
            Users
          </Link>
          <Link href="/admin/posts" className="text-gray-700 font-medium hover:text-orange-600 transition-colors">
            Posts
          </Link>
          <Link href="/admin/books" className="text-gray-700 font-medium hover:text-orange-600 transition-colors">
            Books
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}