'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/api/axios'
import { socket } from '@/lib/socket'
import ChatBox from './ChatBox'
import { MessageSquare, Search, X, Users } from 'lucide-react'

interface Conversation {
  _id: string
  lastMessage: string
  lastTime: string
  name?: string
  profilePicture?: string
}

export default function ConversationsPanel() {
  const [convos, setConvos] = useState<Conversation[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)

  // Load initial conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await axios.get('/api/v1/chat/conversations')
        setConvos(res.data.data)
      } catch (err) {
        console.error('Failed to load conversations', err)
      }
    }
    loadConversations()
  }, [])

  // Listen for new messages safely
  useEffect(() => {
    const handleReceive = (msg: any) => {
      setConvos(prev => {
        const otherId = msg.senderId !== msg.receiverId ? msg.senderId : msg.receiverId
        const existing = prev.find(c => c._id === otherId)

        if (existing) {
          return [
            { ...existing, lastMessage: msg.message || msg.content, lastTime: msg.createdAt },
            ...prev.filter(c => c._id !== existing._id)
          ]
        }
        return prev
      })
    }

    socket.on('receiveMessage', handleReceive)
    return () => {
      socket.off('receiveMessage', handleReceive)
    }
  }, [])

  return (
    <div className="fixed bottom-24 right-6 w-[350px] h-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-2 border-orange-100 flex flex-col z-50 animate-scale-in overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <MessageSquare size={20} className="text-white" />
          </div>
          <h3 className="text-white font-bold text-lg tracking-tight">Messages</h3>
        </div>
        <button 
          onClick={() => setActiveChat(null)}
          className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!activeChat ? (
          <>
            {/* Search */}
            <div className="p-4 bg-orange-50/50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-white border-2 border-orange-100 rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 placeholder-orange-300/70 transition-all duration-200"
                />
              </div>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-themed">
              {convos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-10 opacity-40">
                  <Users size={48} className="text-orange-400 mb-2" />
                  <p className="text-sm font-medium text-orange-800">No conversations yet</p>
                </div>
              ) : (
                convos.map(c => (
                  <div
                    key={c._id}
                    className="flex items-center gap-4 p-3 mx-2 my-1 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-orange-100 group"
                    onClick={() => setActiveChat(c._id)}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 p-[2px] ring-2 ring-white shadow-md group-hover:scale-105 transition-transform duration-200">
                        <img
                          src={c.profilePicture ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${c.profilePicture}` : '/default-avatar.png'}
                          alt={c.name || c._id}
                          className="w-full h-full rounded-full object-cover bg-white"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                          {c.name || c._id}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1 group-hover:text-gray-700 transition-colors">
                        {c.lastMessage || "Click to start chatting..."}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col animate-scale-in overflow-hidden">
            <div className="p-2 bg-orange-50/50 flex items-center">
              <button 
                onClick={() => setActiveChat(null)}
                className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-rose-600 p-2 rounded-xl transition-all duration-200"
              >
                ← Back to list
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatBox userId={activeChat} close={() => setActiveChat(null)} />
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx global>{`
        .scrollbar-themed::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-themed::-webkit-scrollbar-track {
          background: rgba(255, 237, 213, 0.1);
          border-radius: 10px;
        }
        .scrollbar-themed::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #f43f5e);
          border-radius: 10px;
          opacity: 0.5;
        }
        .scrollbar-themed::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #e11d48);
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}