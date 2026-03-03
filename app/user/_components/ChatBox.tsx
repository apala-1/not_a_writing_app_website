'use client'

import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/api/axios'
import { socket } from '@/lib/socket'
import { Send, Paperclip, X, MoreVertical, Edit2, Trash2, Check, Smile } from 'lucide-react'

interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image'
  createdAt: string
  edited?: boolean
}

export default function ChatBox({ userId, close }: { userId: string; close: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [me, setMe] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [contextMenu, setContextMenu] = useState<{msgId: string} | null>(null)
  const [isSending, setIsSending] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch current user
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/api/v1/auth/me')
        setMe(res.data.data._id)
      } catch (err) {
        console.error('Failed to fetch user', err)
      }
    }
    fetchMe()
  }, [])

  // Load messages and listen to socket
  useEffect(() => {
    if (!me) return

    const loadMessages = async () => {
      try {
        const res = await axios.get(`/api/v1/chat/conversation/${me}/${userId}`)
        const msgs: Message[] = res.data.data.map((m: any) => ({
          _id: m._id,
          senderId: m.senderId,
          receiverId: m.receiverId,
          content: m.content || m.message,
          type: m.type || 'text',
          createdAt: m.createdAt,
          edited: m.edited || false
        }))
        setMessages(msgs)
        await axios.post(`/api/v1/chat/mark-as-read`, { senderId: userId })
        scrollToBottom()
      } catch (err) {
        console.error('Load messages failed', err)
      }
    }

    loadMessages()

    const handleReceive = (msg: any) => {
      const newMsg: Message = {
        _id: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content || msg.message,
        type: msg.type || 'text',
        createdAt: msg.createdAt
      }
      if (newMsg.senderId === userId || newMsg.receiverId === userId) {
        setMessages(prev => [...prev, newMsg])
        scrollToBottom()
      }
    }

    socket.on('receiveMessage', handleReceive)
    return () => { socket.off('receiveMessage', handleReceive) }
  }, [me, userId])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }, 100)
  }

  const sendMessage = async (file?: File) => {
    if (!text.trim() && !file) return
    if (!me) return

    try {
      setIsSending(true)
      const formData = new FormData()
      formData.append('receiverId', userId)
      if (file) {
        formData.append('file', file)
        formData.append('type', 'image')
      } else {
        formData.append('message', text)
        formData.append('type', 'text')
      }

      const res = await axios.post('/api/v1/chat/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const newMsg: Message = {
        _id: res.data.data._id,
        senderId: res.data.data.senderId,
        receiverId: res.data.data.receiverId,
        content: res.data.data.content,
        type: res.data.data.type,
        createdAt: res.data.data.createdAt
      }

      setMessages(prev => [...prev, newMsg])
      socket.emit('sendMessage', newMsg)
      setText('')
      scrollToBottom()
    } catch (err) {
      console.error('Send message failed', err)
    } finally {
      setIsSending(false)
    }
  }

  const startEdit = (msg: Message) => {
    setEditingId(msg._id)
    setEditingText(msg.content)
    setContextMenu(null)
  }

  const saveEdit = async () => {
    if (!editingId || !editingText.trim()) return
    try {
      const res = await axios.put(`/api/v1/chat/edit/${editingId}`, { content: editingText })
      setMessages(prev => prev.map(m =>
        m._id === editingId ? { ...m, content: editingText, edited: true } : m
      ))
      setEditingId(null)
      setEditingText('')
    } catch (err) {
      console.error('Edit failed', err)
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      await axios.delete(`/api/v1/chat/delete/${id}`)
      setMessages(prev => prev.filter(m => m._id !== id))
      setContextMenu(null)
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  return (
    <div className="flex flex-col h-[450px] bg-white rounded-2xl shadow-2xl border-2 border-orange-100 overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-white font-bold text-sm">Chatting...</span>
        </div>
        <button 
          onClick={close}
          className="p-1 hover:bg-white/20 rounded-lg transition-all duration-200"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50/30 scrollbar-themed"
        onClick={() => setContextMenu(null)}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <Smile size={48} className="text-orange-400 mb-2" />
            <p className="text-sm font-medium text-orange-800">Start the conversation!</p>
          </div>
        ) : (
          messages.map(m => (
            <div
              key={m._id}
              className={`flex flex-col ${m.senderId === me ? 'items-end' : 'items-start'}`}
            >
              <div className="relative group max-w-[80%]">
                <div 
                  className={`px-4 py-2 rounded-2xl shadow-sm break-words relative transition-all duration-200 ${
                    m.senderId === me 
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-orange-100'
                  }`}
                >
                  {editingId === m._id ? (
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <textarea
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        className="w-full bg-white/10 border border-white/30 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                        autoFocus
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="text-xs hover:underline">Cancel</button>
                        <button onClick={saveEdit} className="text-xs bg-white text-orange-600 px-2 py-1 rounded font-bold">Save</button>
                      </div>
                    </div>
                  ) : m.type === 'text' ? (
                    <div className="flex flex-col">
                      <span className="text-sm">{m.content}</span>
                      {m.edited && (
                        <span className={`text-[10px] mt-1 opacity-70 ${m.senderId === me ? 'text-white' : 'text-gray-400'}`}>
                          (edited)
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden border-2 border-white/20">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${m.content.replaceAll(' ', '%20')}`} 
                        className="max-w-full rounded h-auto hover:scale-105 transition-transform duration-300 cursor-pointer" 
                        alt="attachment"
                      />
                    </div>
                  )}

                  {/* Options Menu for My Messages */}
                  {m.senderId === me && editingId !== m._id && (
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu(prev => prev?.msgId === m._id ? null : { msgId: m._id });
                        }}
                        className="p-1 text-orange-400 hover:text-orange-600 bg-white rounded-full shadow-md border border-orange-100"
                      >
                        <MoreVertical size={14} />
                      </button>
                      
                      {contextMenu?.msgId === m._id && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white border-2 border-orange-100 rounded-xl shadow-xl p-1 flex flex-col z-50 animate-scale-in min-w-[100px]">
                          <button 
                            onClick={() => startEdit(m)} 
                            className="flex items-center gap-2 px-3 py-2 text-xs text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button 
                            onClick={() => deleteMessage(m._id)} 
                            className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className={`text-[10px] mt-1 block opacity-60 px-1 ${m.senderId === me ? 'text-right' : 'text-left'}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t-2 border-orange-100">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type a message..."
              className="w-full border-2 border-orange-100 bg-orange-50/30 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-orange-400/50 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 resize-none max-h-32 min-h-[48px]"
              rows={1}
            />
            <button
              className="absolute right-3 bottom-3 p-1 text-orange-400 hover:text-orange-600 transition-all duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) sendMessage(e.target.files[0]) }}
            />
          </div>

          <button
            disabled={!text.trim() || isSending}
            onClick={() => sendMessage()}
            className="p-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
          >
            {isSending ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-themed::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-themed::-webkit-scrollbar-track {
          background: rgba(255, 237, 213, 0.3);
          border-radius: 10px;
        }
        .scrollbar-themed::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #f43f5e);
          border-radius: 10px;
        }
        .scrollbar-themed::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #e11d48);
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
