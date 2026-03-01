"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare, Bookmark } from "lucide-react";
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

const toggleSave = async (postId: string) => {
  try {
    await axios.post(`/api/v1/post/toggle-save/${postId}`);
    setPosts(prev => prev.map(p =>
      p._id === postId
        ? {
            ...p,
            isSaved: !p.isSaved,
            savesCount: p.isSaved ? p.savesCount - 1 : p.savesCount + 1
          }
        : p
    ));
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
      : drafts;  // <-- show drafts in drafts tab

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

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/v1/post/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      setSavedPosts(prev => prev.filter(p => p._id !== postId));
      setLikedPosts(prev => prev.filter(p => p._id !== postId));
      if (selectedPost?._id === postId) setSelectedPost(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return <p className="p-6 text-red-500">Profile not found</p>;

  return (
    <main className="bg-gray-50 min-h-screen py-10 px-4 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">

          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {profile?.profilePicture && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 flex flex-col gap-3 items-center md:items-start">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{profile?.name}</h1>
            </div>

            <div className="flex gap-6 text-gray-700 font-medium">
  <span>{profile?.postsCount} posts</span>

  <button
    onClick={fetchFollowers}
    className="hover:underline"
  >
    {profile?.followersCount} followers
  </button>

  <button
    onClick={fetchFollowing}
    className="hover:underline"
  >
    {profile?.followingCount} following
  </button>
</div>

            <p className="text-gray-500">{profile?.bio || "No bio yet"}</p>

            <div className="flex gap-4 mt-2">
              <button className="px-4 py-1 border rounded-md text-gray-700 font-medium hover:bg-gray-200 transition">
                <Link href={`/user/profile/${profile?.userId}/edit`}>Edit profile</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t pt-4">
          <div className="flex justify-center gap-12 text-gray-500">
            <button onClick={() => setActiveTab("posts")} className={`flex items-center gap-2 pb-2 ${activeTab === "posts" ? "text-black border-b-2 border-black" : ""}`}>📷 POSTS</button>
            <button onClick={() => setActiveTab("saved")} className={`flex items-center gap-2 pb-2 ${activeTab === "saved" ? "text-black border-b-2 border-black" : ""}`}>🔖 SAVED</button>
            <button onClick={() => setActiveTab("liked")} className={`flex items-center gap-2 pb-2 ${activeTab === "liked" ? "text-black border-b-2 border-black" : ""}`}>❤️ LIKED</button>
              <button onClick={() => setActiveTab("drafts")} className={`flex items-center gap-2 pb-2 ${activeTab === "drafts" ? "text-black border-b-2 border-black" : ""}`}>📝 DRAFTS</button>

          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedPosts.map(post => (
    <div key={post._id} className="relative bg-white rounded-lg overflow-hidden border">
      {activeTab === "drafts" && (
  <span className="absolute top-0 left-0 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-br">DRAFT</span>
)}

              {post.author._id === profile._id && (
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(post); }} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100">Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post._id); }} className="px-2 py-1 text-xs bg-red-100 border text-red-600 rounded hover:bg-red-200">Delete</button>
                </div>
              )}

              {post.attachments?.map((att, idx) => (
                <img key={idx} src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${att.url}`} alt="Post" className="w-full h-64 object-cover relative z-0" onClick={() => setSelectedPost(post)} />
              ))}

              {/* Likes & Saves */}
              <div className="flex justify-between items-center p-2 text-gray-600">
                <button className={`flex items-center gap-1 ${post.isLiked ? "text-blue-600" : ""}`} onClick={() => toggleLike(post._id)}>
                  <ThumbsUp size={16} fill={post.isLiked ? "currentColor" : "none"} /> {post.likesCount}
                </button>
                <button className={`flex items-center gap-1 ${post.isSaved ? "text-yellow-500" : ""}`} onClick={() => toggleSave(post._id)}>
                  <Bookmark size={16} fill={post.isSaved ? "currentColor" : "none"} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Followers / Following Modal */}
        {showUsers && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white w-80 max-h-96 overflow-y-auto rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold capitalize">{showUsers}</h2>
        <button onClick={() => setShowUsers(null)}>✖</button>
      </div>

      {(showUsers === "followers" ? followers : following)?.map((user) => (
  <div key={user._id} className="flex items-center gap-3 py-2 border-b">
    <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
      {user.profilePicture && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${user.profilePicture}`}
          className="w-full h-full object-cover"
        />
      )}
    </div>
    <span>{user.name}</span>
  </div>
))}
    </div>
  </div>
)}

        {/* Selected Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-4xl rounded-lg overflow-hidden flex flex-col md:flex-row relative">
              <button onClick={() => setSelectedPost(null)} className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl">✖</button>
              <div className="md:w-1/2 bg-black flex items-center justify-center">
                {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                  <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedPost.attachments[0].url}`} alt="Post" className="max-h-[500px] object-contain" />
                )}
              </div>
              <div className="md:w-1/2 p-6 flex flex-col">
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    {profile?.profilePicture && <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`} className="w-full h-full object-cover" />}
                  </div>
                  <span className="font-semibold">{profile?.name}</span>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  <p className="text-gray-800">{selectedPost.content}</p>
                </div>
                <div className="border-t pt-3 flex justify-between text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <ThumbsUp size={18} /> <span>{selectedPost.likesCount} Likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} /> <span>{selectedPost.commentsCount} Comments</span>
                  </div>
                </div>
                {selectedPost.author._id === profile.userId && (
                  <button onClick={() => handleDeletePost(selectedPost._id)} className="mt-2 px-4 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm">Delete Post</button>
                )}
              </div>
            </div>
          </div>
        )}

        {editPost && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-96 p-4 rounded-lg flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Edit Post</h2>
      <input
        type="text"
        value={editTitle}
        onChange={e => setEditTitle(e.target.value)}
        placeholder="Title"
        className="border px-2 py-1 rounded"
      />
      <textarea
        value={editDescription}
        onChange={e => setEditDescription(e.target.value)}
        placeholder="Description"
        className="border px-2 py-1 rounded"
      />
      <textarea
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
        placeholder="Content"
        className="border px-2 py-1 rounded"
      />
      <input
        type="file"
        multiple
        onChange={e => setEditAttachments(Array.from(e.target.files || []))}
      />

      <input
  type="file"
  multiple
  onChange={e => setEditAttachments(Array.from(e.target.files || []))}
/>

{/* Existing attachments list */}
<div className="flex flex-col gap-1 mt-2">
  {editExistingAttachments.map(att => (
    <div key={att._id} className="flex justify-between items-center bg-gray-100 p-1 rounded">
      <span className="truncate">{att.url}</span>
      <button
        className="text-red-500"
        onClick={() =>
          setEditExistingAttachments(prev => prev.filter(a => a._id !== att._id))
        }
      >
        Delete
      </button>
    </div>
  ))}
</div>

      <div className="flex justify-end gap-2 mt-2">
        <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setEditPost(null)}>Cancel</button>
        <button className="px-3 py-1 rounded bg-blue-500 text-white" onClick={async () => {
          if (!editPost) return;
          const formData = new FormData();
formData.append("title", editTitle);
formData.append("description", editDescription);
formData.append("content", editContent);

// new files
editAttachments.forEach(file => formData.append("attachments", file));

// existing attachments (send IDs or URLs)
editExistingAttachments.forEach(att => formData.append("existingAttachments[]", att._id || att.url));

          try {
            const res = await axios.put(`/api/v1/post/${editPost._id}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            updatePostInState(editPost._id, res.data.data);
            setEditPost(null);
          } catch (err) {
            console.error(err);
          }
        }}>Save</button>
      </div>
    </div>
  </div>
)}

      </div>
    </main>
  );
}