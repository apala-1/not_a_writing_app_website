'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, PenLine, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth/storage';
import axios from '@/lib/api/axios';

interface User {
  name: string;
  profilePicture?: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/v1/auth/me');
        if (res.data.success) setUser(res.data.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };
    fetchUser();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b-[3px] border-blue-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-2 rounded-xl text-white">
            <PenLine size={24} className="text-gray-800" strokeWidth={2.5} />
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <input
            type="text"
            placeholder="Search posts, writers, tags.."
            className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-full focus:outline-none focus:border-gray-500 bg-transparent text-sm"
          />
          <Search
            size={18}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-full text-sm transition-colors flex items-center gap-1">
            <span>+</span> Write
          </button>

          {/* Profile dropdown */}
          <div ref={dropdownRef} className="relative">
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {user?.profilePicture ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${user.profilePicture}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-gray-500">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <ChevronDown size={16} />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900" onClick={() => router.push("/")}>
                  Home
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900">
                  Settings
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900"
                  onClick={() => {
                    clearToken();
                    router.push('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}