"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare, Bookmark, Edit2, Trash2, X } from "lucide-react";
import axios from "@/lib/api/axios";
import { Post } from "@/lib/types/post";
import Link from "next/link";

interface Profile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

// Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "liked" | "drafts">("posts");
  const [showUsers, setShowUsers] = useState<null | "followers" | "following">(null);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAttachments, setEditAttachments] = useState<File[]>([]);
  const [editExistingAttachments, setEditExistingAttachments] = useState<{url: string, _id: string}[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch profile & posts
  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profileRes, postsRes, savedRes, likedRes] = await Promise.all([
          axios.get(`/api/v1/profile/me`),
          axios.get(`/api/v1/profile/me/posts`),
          axios.get(`/api/v1/profile/me/posts/saved`),
          axios.get(`/api/v1/profile/me/posts/liked`),
        ]);

        if (profileRes.data.success) setProfile(profileRes.data.data);
        if (postsRes.data.success) setPosts(postsRes.data.data);
        if (savedRes.data.success) setSavedPosts(savedRes.data.data);
        if (likedRes.data.success) setLikedPosts(likedRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const res = await axios.get(`/api/v1/post/drafts`);
        if(res.data.success) setDrafts(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDrafts();
  }, []);

  // Fetch followers/following
  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`/api/v1/profile/${profile!.userId}/followers`);
      setFollowers(res.data.data);
      setShowUsers("followers");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`/api/v1/profile/${profile!.userId}/following`);
      setFollowing(res.data.data);
      setShowUsers("following");
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to update posts in all tabs
  const updatePostInState = (postId: string, changes: Partial<Post>) => {
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, ...changes } : p));
    setSavedPosts(prev => prev.map(p => p._id === postId ? { ...p, ...changes } : p));
    setLikedPosts(prev => prev.map(p => p._id === postId ? { ...p, ...changes } : p));
    setDrafts(prev => prev.map(p => p._id === postId ? { ...p, ...changes } : p));
  };

  // Like / Save functionality
  const toggleLike = async (postId: string) => {
    try {
      await axios.post(`/api/v1/post/toggle-like/${postId}`);
      updatePostInState(postId, {
        isLiked: !displayedPosts.find(p => p._id === postId)?.isLiked,
        likesCount: displayedPosts.find(p => p._id === postId)?.isLiked 
          ? (displayedPosts.find(p => p._id === postId)?.likesCount || 0) - 1 
          : (displayedPosts.find(p => p._id === postId)?.likesCount || 0) + 1
      });
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const toggleSave = async (postId: string) => {
    try {
      await axios.post(`/api/v1/post/toggle-save/${postId}`);
      updatePostInState(postId, {
        isSaved: !displayedPosts.find(p => p._id === postId)?.isSaved,
        savesCount: displayedPosts.find(p => p._id === postId)?.isSaved 
          ? (displayedPosts.find(p => p._id === postId)?.savesCount || 0) - 1 
          : (displayedPosts.find(p => p._id === postId)?.savesCount || 0) + 1
      });
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const displayedPosts = activeTab === "posts"
    ? posts
    : activeTab === "saved"
      ? savedPosts
      : activeTab === "liked"
        ? likedPosts
        : drafts;

  const openEditModal = (post: Post) => {
    setEditPost(post);
    setEditTitle(post.title || '');
    setEditDescription(post.description || '');
    setEditContent(post.content || '');
    setEditAttachments([]);
    setEditExistingAttachments(
      (post.attachments || []).map(att => ({ url: att.url, _id: att._id || att.url }))
    );
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/v1/post/${postToDelete}`);
      setPosts(prev => prev.filter(p => p._id !== postToDelete));
      setSavedPosts(prev => prev.filter(p => p._id !== postToDelete));
      setLikedPosts(prev => prev.filter(p => p._id !== postToDelete));
      setDrafts(prev => prev.filter(p => p._id !== postToDelete));
      if (selectedPost?._id === postToDelete) setSelectedPost(null);
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editPost) return;
    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      formData.append("content", editContent);
      editAttachments.forEach(file => formData.append("attachments", file));
      editExistingAttachments.forEach(att => formData.append("existingAttachments[]", att._id || att.url));

      const res = await axios.put(`/api/v1/post/${editPost._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updatePostInState(editPost._id, res.data.data);
      setEditPost(null);
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
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
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 overflow-hidden flex-shrink-0 ring-4 ring-white shadow-lg">
                {profile?.profilePicture ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>

              {/* Stats */}
              <div className="flex gap-8 text-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{profile?.postsCount}</div>
                  <div className="text-sm text-gray-600">posts</div>
                </div>

                <button onClick={fetchFollowers} className="text-center hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl font-bold text-orange-600">{profile?.followersCount}</div>
                  <div className="text-sm text-gray-600 hover:text-orange-600">followers</div>
                </button>

                <button onClick={fetchFollowing} className="text-center hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl font-bold text-orange-600">{profile?.followingCount}</div>
                  <div className="text-sm text-gray-600 hover:text-orange-600">following</div>
                </button>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-center md:text-left max-w-2xl">
                {profile?.bio || "No bio yet"}
              </p>

              {/* Edit Profile Button */}
              <Link href={`/user/profile/${profile?.userId}/edit`}>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 mb-6">
          <div className="flex justify-center gap-2 p-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "posts"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              POSTS
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "saved"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Bookmark size={20} />
              SAVED
            </button>

            <button
              onClick={() => setActiveTab("liked")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "liked"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ThumbsUp size={20} />
              LIKED
            </button>

            <button
              onClick={() => setActiveTab("drafts")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "drafts"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              DRAFTS
            </button>
          </div>
        </div>

        {/* Content Section */}
        {displayedPosts.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} yet</h3>
            <p className="text-gray-600">
              {activeTab === "posts" && "Start sharing your thoughts and creativity!"}
              {activeTab === "saved" && "Save posts you love to view them here."}
              {activeTab === "liked" && "Like posts to see them in this collection."}
              {activeTab === "drafts" && "Your draft posts will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map(post => (
              <div key={post._id} className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-200 group">
                
                {/* Draft Badge */}
                {activeTab === "drafts" && (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-md">
                      DRAFT
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                {post.author._id === profile._id && (
                  <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(post); }}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-md"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPostToDelete(post._id);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-md"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                )}

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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      post.isSaved
                        ? "text-yellow-600 bg-yellow-50"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleSave(post._id); }}
                  >
                    <Bookmark size={18} fill={post.isSaved ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Followers / Following Modal */}
        {showUsers && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[600px] overflow-hidden animate-scale-in">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-50 to-rose-50">
                <h2 className="text-xl font-bold text-gray-900 capitalize">{showUsers}</h2>
                <button
                  onClick={() => setShowUsers(null)}
                  className="p-2 hover:bg-white rounded-lg transition-all duration-200"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Users List */}
              <div className="overflow-y-auto max-h-[500px] p-4">
                {(showUsers === "followers" ? followers : following).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">No {showUsers} yet</p>
                  </div>
                ) : (
                  (showUsers === "followers" ? followers : following).map((user) => (
                    <div key={user._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 overflow-hidden flex-shrink-0">
                        {user.profilePicture ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${user.profilePicture}`}
                            className="w-full h-full object-cover"
                            alt={user.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
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
                    {profile?.profilePicture ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`}
                        className="w-full h-full object-cover"
                        alt={profile.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-gray-900">{profile?.name}</span>
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
                </div>

                {/* Stats and Actions */}
                <div className="border-t p-6 bg-gray-50">
                  <div className="flex justify-between text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp size={20} className="text-orange-500" />
                      <span className="font-medium">{selectedPost.likesCount} Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare size={20} className="text-orange-500" />
                      <span className="font-medium">{selectedPost.commentsCount} Comments</span>
                    </div>
                  </div>

                  {selectedPost.author._id === profile.userId && (
                    <button
                      onClick={() => {
                        setPostToDelete(selectedPost._id);
                        setShowDeleteModal(true);
                      }}
                      className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete Post
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Post Modal */}
        {editPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
                <button
                  onClick={() => setEditPost(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Brief description"
                    rows={2}
                    className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder="Write your post content here..."
                    rows={6}
                    className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Existing Attachments */}
                {editExistingAttachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Attachments</label>
                    <div className="space-y-2">
                      {editExistingAttachments.map(att => (
                        <div key={att._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <span className="text-sm text-gray-700 truncate flex-1">{att.url}</span>
                          <button
                            onClick={() => setEditExistingAttachments(prev => prev.filter(a => a._id !== att._id))}
                            className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Attachments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Add New Attachments</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => setEditAttachments(Array.from(e.target.files || []))}
                    className="w-full border-2 border-gray-200 bg-gray-50/50 rounded-xl px-4 py-3 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 file:font-medium hover:file:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200"
                  />
                  {editAttachments.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">{editAttachments.length} new file(s) selected</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditPost(null)}
                  disabled={editLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setPostToDelete(null);
          }}
          onConfirm={handleDeletePost}
          title="Delete Post?"
          message="This action cannot be undone. Your post will be permanently deleted."
          confirmText="Yes, Delete Post"
          loading={deleteLoading}
        />
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
