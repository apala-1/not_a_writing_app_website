'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/api/axios'
import { socket } from '@/lib/socket'
import ChatBox from './ChatBox'

interface Conversation {
  _id: string // userId of the other person
  lastMessage: string
  lastTime: string
  name?: string
  profilePicture?: string
}

export default function ConversationsPanel() {
  const [convos, setConvos] = useState<Conversation[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const res = await axios.get('/api/v1/chat/conversations')
      setConvos(res.data.data)
    }
    load()
  }, [])

  // optional: listen for new messages in real time
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setConvos(prev => {
        const existing = prev.find(c => c._id === (msg.senderId !== msg.receiverId ? msg.senderId : msg.receiverId))
        if (existing) {
          // move updated conversation to top
          return [
            { ...existing, lastMessage: msg.message, lastTime: msg.createdAt },
            ...prev.filter(c => c._id !== existing._id)
          ]
        }
        return prev
      })
    })
    return () => {
      socket.off('receiveMessage')
    }
  }, [])

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white shadow-xl rounded-xl p-4 z-50">
      <h3 className="font-semibold mb-3">Messages</h3>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {convos.map(c => (
          <div
            key={c._id}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setActiveChat(c._id)}
          >
            <img
              src={c.profilePicture ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/profiles/${c.profilePicture}` : '/default-avatar.png'}
              alt={c.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{c.name || c._id}</p>
              <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Inline chat box */}
      {activeChat && <ChatBox userId={activeChat} close={() => setActiveChat(null)} />}
    </div>
  )
}