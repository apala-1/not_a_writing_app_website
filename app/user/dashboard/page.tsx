"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { Post } from "@/lib/types/post";


export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
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
                <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                  <ThumbsUp size={16} />
                  <span className="text-xs font-medium">{post.likesCount}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                  <MessageSquare size={16} />
                  <span className="text-xs font-medium">{post.commentsCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}