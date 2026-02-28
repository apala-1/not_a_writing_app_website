'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/api/axios';
import { ThumbsUp, MessageSquare } from 'lucide-react';

interface UserProfile {
  userId: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface Post {
  _id: string;
  content: string;
  attachments?: { url: string }[];
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export default function UserProfilePage() {
  const { id } = useParams(); // matches [id] folder
const userId = id; // now userId is defined
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch profile info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/v1/profile/profile/${userId}`);
        if (res.data.success) setProfile(res.data.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/v1/profile/profile/${userId}/posts`);
        if (res.data.success) setPosts(res.data.data);
      } catch (err) {
        console.error('Failed to load posts', err);
      }
    };

    const fetchFollowStatus = async () => {
      try {
        const res = await axios.get(`/api/v1/follow/status/${userId}`);
        if (res.data.success) setIsFollowing(res.data.data.isFollowing);
      } catch (err) {
        console.error('Failed to get follow status', err);
      }
    };

    fetchProfile();
    fetchPosts();
    fetchFollowStatus();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post('/api/v1/follow/unfollow', { targetUserId: userId });
        setIsFollowing(false);
        setProfile(prev => prev ? { ...prev, followersCount: prev.followersCount - 1 } : prev);
      } else {
        await axios.post('/api/v1/follow/follow', { targetUserId: userId });
        setIsFollowing(true);
        setProfile(prev => prev ? { ...prev, followersCount: prev.followersCount + 1 } : prev);
      }
    } catch (err) {
      console.error('Follow/unfollow failed', err);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      {profile && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {profile.profilePicture ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gray-500 text-3xl">
                  {profile.name[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.bio}</p>
              <div className="flex gap-6 mt-2 text-gray-700 text-sm">
                <span>{profile.postsCount} Posts</span>
                <span>{profile.followersCount} Followers</span>
                <span>{profile.followingCount} Following</span>
              </div>
            </div>
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isFollowing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                {post.attachments && post.attachments.length > 0 && (
                  <div className="mb-3">
                    {post.attachments.map((att, idx) => (
                      <img
                        key={idx}
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${att.url}`}
                        alt="Post attachment"
                        className="w-full h-auto object-cover rounded-lg mb-2"
                      />
                    ))}
                  </div>
                )}
                <p className="text-gray-700 mb-2">{post.content}</p>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} /> {post.likesCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} /> {post.commentsCount}
                  </div>
                  <span className="ml-auto text-gray-400 text-xs">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-gray-500 text-center">No posts yet.</p>}
          </div>
        </div>
      )}
    </main>
  );
}