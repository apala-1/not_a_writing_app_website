'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/api/axios';
import { socket } from '@/lib/socket';

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export default function ChatPage() {
  const params = useParams();
const userId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [me, setMe] = useState<string | null>(null);

  // get current user
  useEffect(() => {
    const fetchMe = async () => {
      const res = await axios.get('/api/v1/auth/me');
      setMe(res.data.data._id);
    };
    fetchMe();
  }, []);

  // join socket room
  useEffect(() => {
    if (!me) return;

    socket.emit("join", me);

    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [me]);

  // load conversation
  useEffect(() => {
    if (!me) return;
    console.log("ME:", me);
console.log("USER:", userId);

    const load = async () => {
      const res = await axios.get(`/api/v1/chat/conversation/${me}/${userId}`);
      setMessages(res.data.data);
    };

    load();
  }, [me, userId]);

  const sendMessage = async () => {
    if (!text.trim() || !me) return;

    const msg: Message = {
        senderId: me,
        receiverId: userId,
        message: text,
        createdAt: new Date().toISOString(),
    };

    // save to DB
    await axios.post('/api/v1/chat/send', msg);

    // update UI instantly
    setMessages(prev => [...prev, msg]);

    // send realtime
    socket.emit("sendMessage", msg);

    setText('');
  };

  return (
    <main className="h-screen flex flex-col bg-gray-50">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs px-4 py-2 rounded-xl ${
              m.senderId === me
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-white text-gray-800'
            }`}
          >
            {m.message}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </main>
  );
}