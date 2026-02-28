"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare, TrendingUp, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { Post } from "@/lib/types/post";
import { Comment } from "@/lib/types/comment";


export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get("/api/v1/post"); // hit your backend feed route
        setPosts(res.data.data); // your backend returns { success, data: posts }
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    }

    fetchPosts();
  }, []);

  const toggleLike = async (postId: string) => {
  try {
    const res = await axios.post(`/api/v1/post/toggle-like/${postId}`);

    setPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );
  } catch (err) {
    console.error("Like failed", err);
  }
};

const toggleSave = async (postId: string) => {
  try {
    const res = await axios.post(`/api/v1/post/toggle-save/${postId}`);

    setPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? {
              ...post,
              isSaved: !post.isSaved,
              savesCount: post.isSaved
                ? (post.savesCount || 1) - 1
                : (post.savesCount || 0) + 1,
            }
          : post
      )
    );
  } catch (err) {
    console.error("Save failed", err);
  }
};

const fetchComments = async (postId: string) => {
  try {
    const res = await axios.get(`/api/v1/comments/post/${postId}`);

    setCommentsMap(prev => ({
      ...prev,
      [postId]: res.data.data,
    }));
  } catch (err) {
    console.error("Failed to load comments", err);
  }
};

const addComment = async (postId: string) => {
  const content = commentInput[postId];
  if (!content?.trim()) return;

  try {
    const res = await axios.post("/api/v1/comments", {
      postId,
      content,
    });

    // Optimistic update
    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), res.data.data],
    }));

    setPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      )
    );

    setCommentInput(prev => ({ ...prev, [postId]: "" }));
  } catch (err) {
    console.error("Comment failed", err);
  }
};

  return (
    <main className="bg-gray-50 min-h-screen py-10 relative">
      <div className="max-w-6xl mx-auto px-6 flex gap-10">
        <div className="flex-1 flex flex-col gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    {post.author.profilePicture && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${post.author.profilePicture}`}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleString()}</span>
              </div>

              <div className="text-gray-700 text-sm leading-relaxed mb-6">
                {post.attachments && post.attachments.length > 0 && (
                  <div className="mb-3">
                    {post.attachments.map((attachment, index) => (
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${attachment.url}`}
                        alt="Post attachment"
                        className="w-full h-auto object-cover rounded-lg mb-2"
                      />
                    ))}
                  </div>
                )}
                {post.content}
              </div>

              <div className="flex items-center gap-6 text-gray-400">

              {/* LIKE */}
              <button
                onClick={() => toggleLike(post._id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.isLiked ? "text-blue-600" : "hover:text-gray-600"
                }`}
              >
                <ThumbsUp
                  size={16}
                  fill={post.isLiked ? "currentColor" : "none"}
                />
                <span className="text-xs font-medium">
                  {post.likesCount}
                </span>
              </button>

              {/* COMMENT */}
              {/* COMMENT */}
              <button
                  onClick={async () => {
                    // toggle expanded state
                    setExpandedPosts(prev => ({
                      ...prev,
                      [post._id]: !prev[post._id],
                    }));

                    // fetch comments only if not already loaded
                    if (!commentsMap[post._id]) {
                      await fetchComments(post._id);
                    }
                  }}
                  className="flex items-center gap-1.5 hover:text-gray-600 transition-colors"
                >
                  <MessageSquare size={16} />
                  <span className="text-xs font-medium">{post.commentsCount}</span>
              </button>

              {/* SAVE */}
              <button
                onClick={() => toggleSave(post._id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.isSaved ? "text-yellow-500" : "hover:text-gray-600"
                }`}
              >
                <Bookmark
                  size={16}
                  fill={post.isSaved ? "currentColor" : "none"}
                />
              </button>

            </div>
            {expandedPosts[post._id] && (
  <div className="mt-4 space-y-3">
    {/* Existing comments */}
    {commentsMap[post._id]?.map(comment => (
      <div key={comment._id} className="flex gap-2 text-sm">
        <span className="font-semibold">{comment.user.name}:</span>
        <span>{comment.content}</span>
      </div>
    ))}

    {/* Input */}
    <div className="flex gap-2 mt-2">
      <input
        value={commentInput[post._id] || ""}
        onChange={(e) =>
          setCommentInput(prev => ({
            ...prev,
            [post._id]: e.target.value,
          }))
        }
        placeholder="Write a comment..."
        className="flex-1 border rounded-lg px-3 py-1 text-sm"
      />

      <button
        onClick={() => addComment(post._id)}
        className="text-blue-600 text-sm font-medium"
      >
        Post
      </button>
    </div>
  </div>
)}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}