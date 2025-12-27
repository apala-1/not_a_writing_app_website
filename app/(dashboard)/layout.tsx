'use client';
import { useState, type ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            ☰ Menu
          </button>
          <Link href="/" className="text-2xl font-bold text-orange-600">
            Not A Writing App
          </Link>
        </div>
        <nav className="space-x-6">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <Link href="/logout" className="hover:text-orange-600">Logout</Link>
        </nav>
      </header>

      {/* Body */}
      <div className="flex flex-grow w-full">
        {/* Sidebar (pushes content) */}
        {isOpen && (
          <aside className="w-64 bg-orange-100 shadow-md p-6 transition-all duration-300">
            <h2 className="font-bold text-orange-600 mb-6 text-lg">Dashboard</h2>
            <nav className="flex flex-col gap-3">
              <Link href="/dashboard" className="hover:text-orange-600">Home</Link>
              <Link href="/dashboard/write" className="hover:text-orange-600">Write</Link>
              <Link href="/dashboard/books" className="hover:text-orange-600">My Books</Link>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-8 bg-white transition-all duration-300 ${isOpen ? 'ml-0' : 'w-full'}`}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow px-8 py-6 text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Not A Writing App. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-orange-600">About</Link>
            <Link href="/contact" className="hover:text-orange-600">Contact</Link>
            <Link href="/privacy" className="hover:text-orange-600">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
