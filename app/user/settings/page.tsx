'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/api/axios';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth/storage';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/v1/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
          setNewEmail(res.data.data.email);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // Update email
  const handleChangeEmail = async () => {
    if (!newEmail) return;
    try {
      setLoading(true);
      const res = await axios.put('/api/v1/auth/me', { email: newEmail });
      if (res.data.success) setMessage('Email updated successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  // Trigger password reset via email
  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/v1/auth/forgot-password', { email: user?.email });
      if (res.data.success) setMessage('Password reset link sent to your email');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This is irreversible.')) return;
    try {
      setLoading(true);
      const res = await axios.delete('/api/v1/auth/me');
      if (res.data.success) {
        clearToken();
        router.push('/login');
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      {message && <p className="text-green-600">{message}</p>}

      {/* Change Email */}
      <div className="space-y-2">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleChangeEmail}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-1"
        >
          Save Email
        </button>
      </div>

      {/* Change Password */}
      <div className="space-y-2">
        <label className="block font-medium">Password</label>
        <p className="text-sm text-gray-600">Change your password via email link</p>
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-1"
        >
          Send Reset Link
        </button>
      </div>

      {/* Dark / Light Mode */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Theme</span>
        <button
          onClick={toggleTheme}
          className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded"
        >
          {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
      </div>

      {/* Language Selection */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Language</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="en">English</option>
          <option value="np">Nepali</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Delete Account */}
      <div className="border-t pt-4 mt-4">
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}