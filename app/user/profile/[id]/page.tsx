'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/api/axios';
import { ThumbsUp, MessageSquare, X } from 'lucide-react';

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
  title?: string;
  description?: string;
  content: string;
  attachments?: { url: string; _id?: string }[];
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export default function UserProfilePage() {
  const { id } = useParams();
  const userId = id as string;
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [canMessage, setCanMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Fetch profile info
  useEffect(() => {
    if (!userId) return;
    
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

    const checkOwnProfile = async () => {
      try {
        const res = await axios.get('/api/v1/auth/me');

        if (res.data.success) {
          const me = res.data.data._id;

          setCurrentUserId(me);
          setIsOwnProfile(me === userId);

          // Call can-message after we know who I am
          const msgRes = await axios.get(`/api/v1/follow/can-message/${me}/${userId}`);

          if (msgRes.data.success) {
            setCanMessage(msgRes.data.canMessage);
          }
        }
      } catch (err) {
        console.error('Failed to check own profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchPosts();
    fetchFollowStatus();
    checkOwnProfile();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post('/api/v1/follow/unfollow', { targetUserId: userId });
        setIsFollowing(false);
        setProfile(prev =>
          prev ? { ...prev, followersCount: prev.followersCount - 1 } : prev
        );
      } else {
        await axios.post('/api/v1/follow/follow', { targetUserId: userId });
        setIsFollowing(true);
        setProfile(prev =>
          prev ? { ...prev, followersCount: prev.followersCount + 1 } : prev
        );
      }
    } catch (err) {
      console.error('Follow/unfollow failed', err);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      await axios.post(`/api/v1/post/toggle-like/${postId}`);
      setPosts(prev => prev.map(p => 
        p._id === postId 
          ? { 
              ...p, 
              isLiked: !p.isLiked, 
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 
            } 
          : p
      ));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-medium">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-12 px-4 lg:px-20 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Profile Header Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-6 animate-scale-in">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 overflow-hidden flex-shrink-0 ring-4 ring-white shadow-lg">
                {profile.profilePicture ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-orange-400">
                      {profile.name[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>

              {/* Stats */}
              <div className="flex gap-8 text-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{profile.postsCount}</div>
                  <div className="text-sm text-gray-600">posts</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{profile.followersCount}</div>
                  <div className="text-sm text-gray-600">followers</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{profile.followingCount}</div>
                  <div className="text-sm text-gray-600">following</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-center md:text-left max-w-2xl">
                {profile.bio || "No bio yet"}
              </p>

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                        </svg>
                        Unfollow
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Follow
                      </>
                    )}
                  </button>

                  {canMessage && (
                    <button
                      onClick={() => router.push(`/user/messages/${userId}`)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Posts
          </h2>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">This user hasn't shared anything yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post._id} className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-200 group">
                
                {/* Post Image */}
                <div className="cursor-pointer" onClick={() => setSelectedPost(post)}>
                  {post.attachments && post.attachments.length > 0 ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${post.attachments[0].url}`}
                      alt="Post"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="p-4 flex justify-between items-center bg-gray-50">
                  <button
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      post.isLiked
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleLike(post._id); }}
                  >
                    <ThumbsUp size={18} fill={post.isLiked ? "currentColor" : "none"} />
                    <span className="font-medium">{post.likesCount}</span>
                  </button>

                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setSelectedPost(post)}
                  >
                    <MessageSquare size={18} />
                    <span className="font-medium">{post.commentsCount}</span>
                  </button>
                </div>

                {/* Date overlay */}
                <div className="absolute bottom-20 right-3 px-3 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl animate-scale-in max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-30 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                <X size={24} className="text-gray-600" />
              </button>

              {/* Image Section */}
              <div className="md:w-1/2 bg-black flex items-center justify-center p-4">
                {selectedPost.attachments && selectedPost.attachments.length > 0 ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedPost.attachments[0].url}`}
                    alt="Post"
                    className="max-h-[500px] w-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="md:w-1/2 flex flex-col max-h-[90vh] md:max-h-none">
                {/* Author Info */}
                <div className="flex items-center gap-3 p-6 border-b bg-gray-50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 overflow-hidden">
                    {profile.profilePicture ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`}
                        className="w-full h-full object-cover"
                        alt={profile.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lg font-bold text-orange-400">
                          {profile.name[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-gray-900">{profile.name}</span>
                </div>

                {/* Post Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedPost.title && (
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPost.title}</h2>
                  )}
                  {selectedPost.description && (
                    <p className="text-gray-600 mb-4">{selectedPost.description}</p>
                  )}
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedPost.content}</p>
                  
                  {/* Date */}
                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(selectedPost.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t p-6 bg-gray-50">
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <ThumbsUp size={20} className="text-orange-500" />
                      <span className="font-medium">{selectedPost.likesCount} Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare size={20} className="text-orange-500" />
                      <span className="font-medium">{selectedPost.commentsCount} Comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

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
    </main>
  );
}