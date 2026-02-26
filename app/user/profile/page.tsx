"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";
import axios from "@/lib/api/axios";
import { Post } from "@/lib/types/post";
import Link from "next/link";

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
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "liked">("posts");
  const [showUsers, setShowUsers] = useState<null | "followers" | "following">(null);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

        {/* Stats */}
        <div className="flex gap-6 text-gray-700 font-medium">
          <span>{profile?.postsCount} posts</span>

          <button
            onClick={() => setShowUsers("followers")}
            className="hover:underline"
          >
            {profile?.followersCount} followers
          </button>

          <button
            onClick={() => setShowUsers("following")}
            className="hover:underline"
          >
            {profile?.followingCount} following
          </button>
        </div>

        <p className="text-gray-500">
          {profile?.bio || "No bio yet"}
        </p>

        {/* Only Edit Profile */}
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

        {/* Posts Tab */}
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 pb-2 ${
            activeTab === "posts"
              ? "text-black border-b-2 border-black"
              : ""
          }`}
        >
          📷 POSTS
        </button>

        {/* Saved Tab */}
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 pb-2 ${
            activeTab === "saved"
              ? "text-black border-b-2 border-black"
              : ""
          }`}
        >
          🔖 SAVED
        </button>

        {/* Liked Tab */}
        <button
          onClick={() => setActiveTab("liked")}
          className={`flex items-center gap-2 pb-2 ${
            activeTab === "liked"
              ? "text-black border-b-2 border-black"
              : ""
          }`}
        >
          ❤️ LIKED
        </button>
      </div>
    </div>

    {/* Content Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

      {/* POSTS */}
      {activeTab === "posts" &&
        posts.map((post) => (
          <div
            key={post._id}
            onClick={() => setSelectedPost(post)}
            className="bg-white rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition"
          >
            {post.attachments?.map((att, idx) => (
              <img
                key={idx}
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${att.url}`}
                alt="Post"
                className="w-full h-64 object-cover"
              />
            ))}
          </div>
        ))}

      {/* SAVED */}
      {activeTab === "saved" &&
        savedPosts?.map((post) => (
          <div key={post._id} className="bg-white rounded-lg overflow-hidden border">
            {post.attachments && post.attachments.length > 0 && (
  <img
    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${post.attachments[0].url}`}
    alt="Post"
    className="w-full h-64 object-cover"
  />
)}
          </div>
        ))}

      {/* LIKED */}
      {activeTab === "liked" &&
        likedPosts?.map((post) => (
          <div key={post._id} className="bg-white rounded-lg overflow-hidden border">
            {post.attachments && post.attachments.length > 0 && (
  <img
    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${post.attachments[0].url}`}
    alt="Post"
    className="w-full h-64 object-cover"
  />
)}
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
            <div key={user.userId} className="flex items-center gap-3 py-2 border-b">
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

    {selectedPost && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    
    <div className="bg-white w-[90%] max-w-4xl rounded-lg overflow-hidden flex flex-col md:flex-row relative">

      {/* Close Button */}
      <button
        onClick={() => setSelectedPost(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
      >
        ✖
      </button>

      {/* Left Side - Image */}
      <div className="md:w-1/2 bg-black flex items-center justify-center">
        {selectedPost.attachments &&
          selectedPost.attachments.length > 0 && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedPost.attachments[0].url}`}
              alt="Post"
              className="max-h-[500px] object-contain"
            />
          )}
      </div>

      {/* Right Side - Content */}
      <div className="md:w-1/2 p-6 flex flex-col">

        {/* Author */}
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            {profile?.profilePicture && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${profile.profilePicture}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="font-semibold">{profile?.name}</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <p className="text-gray-800">
            {selectedPost.content}
          </p>
        </div>

        {/* Likes & Comments */}
        <div className="border-t pt-3 flex justify-between text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <ThumbsUp size={18} />
            <span>{selectedPost.likesCount} Likes</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <span>{selectedPost.commentsCount} Comments</span>
          </div>
        </div>

      </div>
    </div>
  </div>
)}

  </div>
</main>
  );
}