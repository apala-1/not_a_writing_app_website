'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/api/axios'
import { socket } from '@/lib/socket'

interface Message {
  senderId: string
  receiverId: string
  message: string
  createdAt: string
}

export default function ChatBox({ userId, close }: { userId: string; close: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [me, setMe] = useState<string>('')

  useEffect(() => {
    const fetchMe = async () => {
      const res = await axios.get('/api/v1/auth/me')
      setMe(res.data.data._id)
    }
    fetchMe()
  }, [])

  useEffect(() => {
  if (!me) return;

  const loadMessages = async () => {
    const res = await axios.get(`/api/v1/chat/conversation/${me}/${userId}`);
    setMessages(res.data.data);

    // Mark messages as read
    await axios.post(`/api/v1/chat/mark-as-read`, { senderId: userId });
  }

  loadMessages();

  socket.on('receiveMessage', (msg: Message) => {
    if (msg.senderId === userId || msg.receiverId === userId) {
      setMessages(prev => [...prev, msg]);
    }
  });

  return () => {
    socket.off('receiveMessage');
  }
}, [me, userId]);

  const sendMessage = async () => {
    if (!text.trim() || !me) return
    const msg: Message = {
      senderId: me,
      receiverId: userId,
      message: text,
      createdAt: new Date().toISOString()
    }

    await axios.post('/api/v1/chat/send', msg)
    setMessages(prev => [...prev, msg])
    socket.emit('sendMessage', msg)
    setText('')
  }

  return (
    <div className="mt-2 border-t pt-2">
      <div className="max-h-60 overflow-y-auto space-y-2 px-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.senderId === me ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-1 rounded-xl break-words max-w-[70%] ${
                m.senderId === me
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {m.message}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-3 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
        <button className="px-2" onClick={close}>X</button>
      </div>
    </div>
  )
}