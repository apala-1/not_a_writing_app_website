'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, PenLine, ChevronDown, X, Paperclip, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth/storage';
import axios from '@/lib/api/axios';
import Link from 'next/link';
import logo from '../../../public/images/pencil.jpg';
import Image from 'next/image';

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch logged-in user
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

  // Click outside to close dropdowns/modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search users
  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchTerm.trim()) return setSearchResults([]);
      try {
        const res = await axios.get('/api/v1/follow/search', {
          params: { q: searchTerm },
        });
        if (res.data.success) setSearchResults(res.data.data);
      } catch (err) {
        console.error('Search failed', err);
      }
    };
    const timeout = setTimeout(fetchSearch, 300); // debounce
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !content) return setError('All fields are required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    attachments.forEach(file => formData.append('attachments', file));

    try {
      const res = await axios.post('/api/v1/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Post created successfully!');
      setError('');
      setTitle('');
      setDescription('');
      setContent('');
      setAttachments([]);
      setTimeout(() => {
        setShowForm(false);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <header className="bg-white border-b-[3px] border-blue-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
            <Link href='/user/dashboard'>
              <Image src={logo} alt="Logo" width={54} height={54} className="w-12 h-12" />
            </Link>
        </div>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
          <input
            type="text"
            placeholder="Search posts, writers, tags.."
            className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-full focus:outline-none focus:border-gray-500 bg-transparent text-sm placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => searchTerm && setSearchOpen(true)}
          />
          <Search
            size={18}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          />

          {searchOpen && searchResults.length > 0 && (
            <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
              {searchResults.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    router.push(`/user/profile/${u._id}`);
                    setSearchOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    {u.profilePicture ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${u.profilePicture}`}
                        alt={u.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-gray-500">
                        {u.name[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-800">{u.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-gray-800">
            <Bell size={20} />
            {/* optional badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Write Button */}
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-full text-sm transition-colors flex items-center gap-1"
            onClick={() => setShowForm(true)}
          >
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
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900" onClick={() => router.push("/user/dashboard")}>Home</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900" onClick={() => router.push("/user/profile")}>Profile</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900" onClick={() => router.push("/user/settings")}>Settings</button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900"
                  onClick={() => {
                    clearToken();
                    router.push('/login');
                  }}
                >Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Modal */}
{showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Blurred semi-transparent overlay */}
    <div
      className="absolute inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm"
      onClick={() => setShowForm(false)} // optional: click outside to close
    ></div>

    {/* Centered modal */}
    <div
      ref={formRef}
      className="relative bg-white w-full max-w-xl p-6 rounded-xl shadow-xl z-50"
    >
      <button
        className="absolute top-4 right-4"
        onClick={() => setShowForm(false)}
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded placeholder-gray-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 rounded placeholder-gray-500"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border px-3 py-2 rounded h-36 placeholder-gray-500"
          required
        />
        {/* Attachments */}
        <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
          <Paperclip size={18} />
          <span className="text-sm">Attach files</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setAttachments(Array.from(e.target.files || []))}
          />
        </label>
        {attachments.length > 0 && (
          <ul className="text-sm text-gray-600 ml-5 list-disc">
            {attachments.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-2"
        >
          Publish
        </button>
      </form>
    </div>
  </div>
)}
    </header>
  );
}