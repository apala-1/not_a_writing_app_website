"use client";

import React, { useEffect, useState } from "react";
import { ThumbsUp, MessageSquare, Bookmark, Send, MoreVertical, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "@/lib/api/axios";
import { Post } from "@/lib/types/post";
import { Comment } from "@/lib/types/comment";

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"feed" | "books" | "explore" | "create">("feed");
  type CommentState = Comment & {
  replies: CommentState[];
  isReplying?: boolean;
  isEditing?: boolean;
  replyContent?: string;
  editContent?: string;
};

type PostState = Post & {
  comments: CommentState[];
  commentInput: string;
};


const [postsState, setPostsState] = useState<PostState[]>([]);
  
  const router = useRouter();

  useEffect(() => {
  async function fetchCurrentUser() {
    try {
      const res = await axios.get("/api/v1/auth/me"); // or your endpoint that returns user info
      setCurrentUserId(res.data.data._id);
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  }
  fetchCurrentUser();
}, []);

  useEffect(() => {
  async function fetchPosts() {
    try {
      const res = await axios.get("/api/v1/post");
      const posts: PostState[] = await Promise.all(
        res.data.data.map(async (post: Post) => {
          const commentsRes = await axios.get(`/api/v1/comments/post/${post._id}`);
          return {
            ...post,
            comments: commentsRes.data.data.map((c: Comment) => ({
              ...c,
              replies: c.replies || [],
              isReplying: false,
              isEditing: false,
              replyContent: "",
              editContent: c.content,
            })),
            commentInput: "",
          };
        })
      );
      setPostsState(posts);
    } catch (err) {
      console.error("Failed to fetch posts with comments", err);
    } finally {
      setLoading(false);
    }
  }

  fetchPosts();
}, []);

  const toggleLike = async (postId: string) => {
    try {
      await axios.post(`/api/v1/post/toggle-like/${postId}`);

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
      await axios.post(`/api/v1/post/toggle-save/${postId}`);

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

  const toggleReply = (postId: string, commentId: string) => {
  setPostsState(prev => prev.map(post => post._id === postId
    ? {...post, comments: post.comments.map(c => c._id === commentId ? {...c, isReplying: !c.isReplying} : c)}
    : post
  ));
};

const addComment = async (postId: string) => {
  const post = postsState.find(p => p._id === postId);
  if (!post?.commentInput?.trim()) return;

  try {
    const res = await axios.post("/api/v1/comments", { postId, content: post.commentInput });
    setPostsState(prev => prev.map(p => p._id === postId
      ? {...p, comments: [...p.comments, {...res.data.data, replies: [], isReplying: false, isEditing: false, replyContent: "", editContent: res.data.data.content}], commentInput: "", commentsCount: p.commentsCount + 1}
      : p
    ));
  } catch (err) {
    console.error(err);
  }
};

const addReply = async (postId: string, commentId: string) => {
  const post = postsState.find(p => p._id === postId);
  const comment = post?.comments.find(c => c._id === commentId);
  if (!comment?.replyContent?.trim()) return;

  try {
    const res = await axios.post("/api/v1/comments/reply", { postId, content: comment.replyContent, parentCommentId: commentId });
    setPostsState(prev => prev.map(p => p._id === postId
      ? {...p, comments: p.comments.map(c => c._id === commentId ? {...c, replies: [...c.replies, {...res.data.data, replies: [], isReplying: false, isEditing: false, replyContent: "", editContent: res.data.data.content}], replyContent: ""} : c)}
      : p
    ));
  } catch (err) {
    console.error(err);
  }
};

const startEditComment = (postId: string, commentId: string) => {
  setPostsState(prev => prev.map(p => p._id === postId
    ? {...p, comments: p.comments.map(c => c._id === commentId ? {...c, isEditing: true} : c)}
    : p
  ));
};

const cancelEditComment = (postId: string, commentId: string) => {
  setPostsState(prev => prev.map(p => p._id === postId
    ? {...p, comments: p.comments.map(c => c._id === commentId ? {...c, isEditing: false, editContent: c.content} : c)}
    : p
  ));
};

const saveEditedComment = async (postId: string, commentId: string) => {
  const post = postsState.find(p => p._id === postId);
  const comment = post?.comments.find(c => c._id === commentId);
  if (!comment) return;

  try {
    await axios.patch(`/api/v1/comments/${commentId}`, { content: comment.editContent });
    setPostsState(prev =>
  prev.map(p =>
    p._id === postId
      ? {
          ...p,
          comments: p.comments.map(c =>
            c._id === commentId
              ? {
                  ...c,
                  content: c.editContent ?? c.content,
                  isEditing: false,
                  editContent: undefined,
                }
              : c
          ),
        }
      : p
  )
);
  } catch (err) {
    console.error(err);
  }
};

const deleteComment = async (postId: string, commentId: string) => {
  try {
    await axios.delete(`/api/v1/comments/${commentId}`);
    setPostsState(prev => prev.map(p => p._id === postId
      ? {...p, comments: p.comments.filter(c => c._id !== commentId)}
      : p
    ));
  } catch (err) {
    console.error(err);
  }
};

  const saveAsDraft = async (postId: string) => {
  try {
    await axios.post(`/api/v1/post/${postId}/save-draft`);
    alert("Post saved as draft!");
  } catch (err) {
    console.error("Save draft failed", err);
  }
};

const reportPost = async (postId: string) => {
  try {
    await axios.post(`/api/v1/post/report/${postId}`);
    alert("Post reported!");
  } catch (err) {
    console.error("Report failed", err);
  }
};

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 text-lg font-medium">Loading your feed...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full px-4 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-2">
              Your Feed
            </h1>
            <p className="text-gray-600">Discover stories from writers you follow</p>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {postsState.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">Follow some writers to see their posts here!</p>
              </div>
            ) : (
              postsState.map((post) => (
                <article 
                  key={post._id} 
                  className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push(`/user/profile/${post.author?._id}`)}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 overflow-hidden ring-2 ring-white shadow-md group-hover:ring-orange-400 transition-all duration-200">
                          {post.author?.profilePicture ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${post.author.profilePicture}`}
                              alt={post.author?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-lg font-bold text-orange-600">
                                {post.author?.name[0]?.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {post.author?.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
  <button
    onClick={() =>
      setOpenDropdown(prev => ({ ...prev, [post._id]: !prev[post._id] }))
    }
    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
  >
    <MoreVertical size={20} className="text-gray-400" />
  </button>

  {openDropdown[post._id] && (
    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
      {post.author?._id === currentUserId ? (
        <button
          onClick={() => saveAsDraft(post._id)}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-xl"
        >
          Save as Draft
        </button>
      ) : (
        <button
          onClick={() => reportPost(post._id)}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-xl"
        >
          Report
        </button>
      )}
    </div>
  )}
</div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    {/* Title */}
                    {post.title && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {post.title}
                      </h2>
                    )}

                    {/* Description */}
                    {post.description && (
                      <p className="text-gray-600 mb-4 font-medium">
                        {post.description}
                      </p>
                    )}

                    {/* Images */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="mb-4 rounded-xl overflow-hidden">
                        {post.attachments.map((attachment, index) => (
                          <img
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${attachment.url}`}
                            alt="Post attachment"
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      {/* Left Actions */}
                      <div className="flex items-center gap-2">
                        {/* Like Button */}
                        <button
                          onClick={() => toggleLike(post._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            post.isLiked
                              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <ThumbsUp
                            size={18}
                            fill={post.isLiked ? "currentColor" : "none"}
                            className="transition-transform duration-200 hover:scale-110"
                          />
                          <span className="text-sm">{post.likesCount}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={async () => {
                            setExpandedPosts(prev => ({
                              ...prev,
                              [post._id]: !prev[post._id],
                            }));

                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            expandedPosts[post._id]
                              ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <MessageSquare size={18} className="transition-transform duration-200 hover:scale-110" />
                          <span className="text-sm">{post.commentsCount}</span>
                        </button>

                        {/* Share Button */}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all duration-200">
                          <Share2 size={18} className="transition-transform duration-200 hover:scale-110" />
                        </button>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => toggleSave(post._id)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          post.isSaved
                            ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <Bookmark
                          size={20}
                          fill={post.isSaved ? "currentColor" : "none"}
                          className="transition-transform duration-200 hover:scale-110"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {expandedPosts[post._id] && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-orange-50/30 to-rose-50/30 animate-scale-in">
                      {/* Comments List */}
                      {post.comments.map(comment => (
  <div key={comment._id} className="flex flex-col gap-2 bg-white p-3 rounded-xl shadow-sm">

    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
        {comment.user.profilePicture ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${comment.user.profilePicture}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold">{comment.user.name?.[0]?.toUpperCase() || "U"}</span>
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold text-sm">{comment.user.name}</p>

        {comment.isEditing ? (
          <div className="flex gap-2 mt-1">
            <input
              className="flex-1 border rounded px-2 py-1"
              value={comment.editContent}
              onChange={e => {
                setPostsState(prev => prev.map(p => p._id === post._id
                  ? {...p, comments: p.comments.map(c => c._id === comment._id ? {...c, editContent: e.target.value} : c)}
                  : p
                ));
              }}
            />
            <button onClick={() => saveEditedComment(post._id, comment._id)}>Save</button>
            <button onClick={() => cancelEditComment(post._id, comment._id)}>Cancel</button>
          </div>
        ) : (
          <p className="text-sm text-gray-700">{comment.content}</p>
        )}

        <div className="flex gap-2 mt-1 text-xs">
          <button onClick={() => toggleReply(post._id, comment._id)} className="text-blue-500">Reply</button>
          {comment.user._id === currentUserId && (
  <>
    <button onClick={() => startEditComment(post._id, comment._id)}>
      Edit
    </button>
    <button onClick={() => deleteComment(post._id, comment._id)}>
      Delete
    </button>
  </>
)}
        </div>
      </div>
    </div>

    {/* Replies */}
    {comment.replies.map(reply => (
      <div key={reply._id} className="flex gap-3 ml-16 mt-2 p-2 bg-gray-50 border-l-2 border-orange-300 rounded-r-xl shadow-sm">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
          {reply.user.profilePicture ? (
            <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${reply.user.profilePicture}`} className="w-full h-full object-cover"/>
          ) : (
            <span className="text-xs font-bold">{reply.user.name?.[0]?.toUpperCase() || "U"}</span>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{reply.user.name}</p>
          <p className="text-sm text-gray-700">{reply.content}</p>
        </div>
      </div>
    ))}

    {/* Reply input */}
    {comment.isReplying && (
      <div className="flex gap-3 mt-2 ml-10 items-end">
        <input
          type="text"
          value={comment.replyContent}
          onChange={e => setPostsState(prev => prev.map(p => p._id === post._id
            ? {...p, comments: p.comments.map(c => c._id === comment._id ? {...c, replyContent: e.target.value} : c)}
            : p
          ))}
          placeholder={`Reply to ${comment.user.name}`}
          className="flex-1 border-2 border-gray-200 bg-white rounded-xl px-4 py-2 text-sm"
        />
        <button onClick={() => addReply(post._id, comment._id)}>Reply</button>
      </div>
    )}
  </div>
))}

                      {/* Add Comment Input */}
                      <div className="flex gap-3 items-end">
                        <input
  type="text"
  value={post.commentInput}
  onChange={(e) =>
    setPostsState(prev => prev.map(p => p._id === post._id ? {...p, commentInput: e.target.value} : p))
  }
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment(post._id);
    }
  }}
  placeholder="Write a comment..."
  className="flex-1 border-2 border-gray-200 bg-white rounded-xl px-4 py-3 text-sm"
/>
                        <button
                          onClick={() => addComment(post._id)}
                          disabled={!post.commentInput?.trim()}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Send size={16} />
                          <span className="hidden sm:inline">Post</span>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
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

        /* Custom scrollbar for comments */
        .max-h-64::-webkit-scrollbar {
          width: 6px;
        }

        .max-h-64::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .max-h-64::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #f43f5e);
          border-radius: 10px;
        }

        .max-h-64::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #e11d48);
        }
      `}</style>
    </main>
  );
}