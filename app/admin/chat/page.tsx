import { Suspense } from "react"
import { ChatContent } from "./chat-content"

function ChatLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading chat sessions...</p>
      </div>
    </div>
  )
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  )
}
