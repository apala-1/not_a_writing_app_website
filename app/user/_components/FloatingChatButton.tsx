'use client'

import { useState } from 'react'
import ConversationsPanel from './ConversationsPanel'

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg text-xl z-50"
      >
        💬
      </button>

      {open && <ConversationsPanel />}
    </>
  )
}