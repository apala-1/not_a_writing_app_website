'use client'

import { useState, useEffect } from 'react'
import ConversationsPanel from './ConversationsPanel'
import axios from '@/lib/api/axios'

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  // fetch unread counts every 5-10 seconds
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get('/api/v1/chat/unread-counts')
        const totalUnread = res.data.data.reduce((acc: number, conv: any) => acc + conv.unreadCount, 0)
        setUnread(totalUnread)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUnread()
    const interval = setInterval(fetchUnread, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
  setOpen(!open);

  if (!open) {
    // The panel is opening, refetch unread count
    fetchUnreadCount();
  }
}

// Move fetchUnread inside a function so we can call it manually
const fetchUnreadCount = async () => {
  try {
    const res = await axios.get('/api/v1/chat/unread-counts');
    const totalUnread = res.data.data.reduce((acc: number, conv: any) => acc + conv.unreadCount, 0);
    setUnread(totalUnread);
  } catch (err) {
    console.error(err);
  }
}

useEffect(() => {
  fetchUnreadCount();
  const interval = setInterval(fetchUnreadCount, 5000);
  return () => clearInterval(interval);
}, []);

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg text-xl z-50"
      >
        💬
        {unread > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full"></span>
        )}
      </button>

      {open && <ConversationsPanel />}
    </>
  )
}