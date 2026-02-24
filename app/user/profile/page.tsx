"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";
import axios from "@/lib/api/axios";
import { jwtDecode } from "jwt-decode";

interface Post {
  _id: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

interface Profile {
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
  async function fetchProfile() {
    try {
      const [profileRes, postsRes] = await Promise.all([
        axios.get(`/api/v1/profile/me`),
        axios.get(`/api/v1/profile/me/posts`),
      ]);

      if (profileRes.data.success) setProfile(profileRes.data.data);
      if (postsRes.data.success) setPosts(postsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchProfile();
}, []);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return <p className="p-6 text-red-500">Profile not found</p>;

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6 flex flex-col gap-6">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            {profile.profilePicture && (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500 mb-2">{profile.bio}</p>
            <div className="flex gap-4 text-gray-600 text-sm">
              <span>Posts: {profile.postsCount}</span>
              <span>Followers: {profile.followersCount}</span>
              <span>Following: {profile.followingCount}</span>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-6">
          {posts.length === 0 && <p className="text-gray-500">No posts yet</p>}

          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            >
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-6 text-gray-400">
                <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                  <ThumbsUp size={16} />
                  <span className="text-xs font-medium">{post.likesCount}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                  <MessageSquare size={16} />
                  <span className="text-xs font-medium">{post.commentsCount}</span>
                </button>
                <span className="text-gray-400 text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}