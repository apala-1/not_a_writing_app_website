'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, PenLine, ChevronDown, X, Paperclip, Bell, Send, Save } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const saveDraft = async () => {
    if (!title && !description && !content) {
      setError('Cannot save empty draft');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('draft', 'true');
    attachments.forEach(file => formData.append('attachments', file));

    try {
      setIsSubmitting(true);
      const res = await axios.post('/api/v1/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Draft saved successfully!');
      setError('');
      setTitle('');
      setDescription('');
      setContent('');
      setAttachments([]);
      setTimeout(() => setShowForm(false), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !content) return setError('All fields are required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    attachments.forEach(file => formData.append('attachments', file));

    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <header className="bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 relative overflow-hidden backdrop-blur-xl border-b-2 border-orange-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href='/user/dashboard' className="group">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-orange-200 group-hover:ring-orange-400 transition-all duration-200 shadow-md group-hover:shadow-lg">
                <Image 
                  src={logo} 
                  alt="Logo" 
                  width={56} 
                  height={56} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                />
              </div>
            </Link>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Not A Writing App
              </h1>
              <p className="text-xs text-gray-500">Share your stories</p>
            </div>
          </div>

          {/* Search */}
          <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts, writers, tags..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 bg-gray-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => searchTerm && setSearchOpen(true)}
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            {searchOpen && searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-white border-2 border-orange-100 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-scale-in">
                {searchResults.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 transition-all duration-200 border-b border-gray-100 last:border-0"
                    onClick={() => {
                      router.push(`/user/profile/${u._id}`);
                      setSearchOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 overflow-hidden ring-2 ring-white shadow-md">
                      {u.profilePicture ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${u.profilePicture}`}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-orange-600 font-bold">
                          {u.name[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{u.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 group">
              <Bell size={22} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>

            {/* Write Button */}
            <button
              className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
              onClick={() => setShowForm(true)}
            >
              <PenLine size={18} />
              <span className="hidden sm:inline">Write</span>
            </button>

            {/* Profile dropdown */}
            <div ref={dropdownRef} className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-rose-200 ring-2 ring-orange-200 group-hover:ring-orange-400 transition-all duration-200 shadow-md">
                  {user?.profilePicture ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${user.profilePicture}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-orange-600 font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border-2 border-orange-100 rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                  <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-rose-50">
                    <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-600">View your profile</p>
                  </div>
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 text-gray-800 font-medium transition-all duration-200 flex items-center gap-3" 
                    onClick={() => router.push("/user/dashboard")}
                  >
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 text-gray-800 font-medium transition-all duration-200 flex items-center gap-3" 
                    onClick={() => router.push("/user/profile")}
                  >
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 text-gray-800 font-medium transition-all duration-200 flex items-center gap-3" 
                    onClick={() => router.push("/user/settings")}
                  >
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium transition-all duration-200 flex items-center gap-3 border-t border-gray-100"
                    onClick={() => {
                      clearToken();
                      router.push('/login');
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Post Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowForm(false)}
          ></div>

          {/* Modal */}
          <div
            ref={formRef}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl z-50 animate-scale-in max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-rose-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-center">
                  <PenLine size={20} className="text-white" />
                </div>
                Create Post
              </h2>
              <button
                className="p-2 hover:bg-white rounded-lg transition-all duration-200"
                onClick={() => !isSubmitting && setShowForm(false)}
                disabled={isSubmitting}
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-scale-in">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3 animate-scale-in">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="Give your post a catchy title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <input
                    type="text"
                    placeholder="Brief description of your post..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                  <textarea
                    placeholder="Share your thoughts, stories, and ideas..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200 min-h-[200px] resize-y"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Attachments</label>
                  <label className="flex items-center justify-center gap-3 w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-orange-50 hover:border-orange-300 rounded-xl px-4 py-6 cursor-pointer transition-all duration-200 group">
                    <div className="w-12 h-12 rounded-full bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-all duration-200">
                      <Paperclip size={20} className="text-orange-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-700 group-hover:text-orange-700">Click to upload files</p>
                      <p className="text-xs text-gray-500 mt-1">Images, videos, or documents</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => setAttachments(prev => [...prev, ...Array.from(e.target.files || [])])}
                      disabled={isSubmitting}
                    />
                  </label>
                  
                  {/* Attachment List */}
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 group hover:bg-orange-100 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                              <Paperclip size={16} className="text-orange-700" />
                            </div>
                            <span className="text-sm text-gray-800 font-medium truncate max-w-xs">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(i)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            disabled={isSubmitting}
                          >
                            <X size={16} className="text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Publish Post
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-gray-300"
                  >
                    <Save size={18} />
                    Save Draft
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}