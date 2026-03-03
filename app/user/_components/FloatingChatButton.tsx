'use client'

import { useState, useEffect, useCallback } from 'react'
import ConversationsPanel from './ConversationsPanel'
import axios from '@/lib/api/axios'
import { MessageCircle } from 'lucide-react'

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await axios.get('/api/v1/chat/unread-counts')
      const totalUnread = res.data.data.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0)
      setUnread(totalUnread)
    } catch (err) {
      console.error('Failed to fetch unread counts', err)
    }
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 10000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  const handleClick = () => {
    setOpen(!open)
    if (!open) fetchUnreadCount()
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center text-white z-[60] transition-all duration-300 group hover:scale-110 hover:rotate-12 ${
          open ? 'rotate-90 scale-110 shadow-orange-200' : ''
        }`}
      >
        <MessageCircle 
          size={28} 
          className={`transition-transform duration-300 ${open ? 'scale-0 opacity-0' : 'scale-100 opacity-100 group-hover:animate-bounce'}`} 
        />
        
        {/* Close icon when open */}
        <span className={`absolute transition-all duration-300 ${open ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>

        {/* Unread Badge */}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 min-w-[24px] h-6 bg-red-500 border-2 border-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow-md px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Backdrop + Panel */}
      {open && (
        <>
          <div 
            className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-40 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-24 right-6 z-50 animate-scale-in">
            <ConversationsPanel />
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  )
}