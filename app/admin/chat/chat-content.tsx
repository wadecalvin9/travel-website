"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MessageCircle, Clock, User } from "lucide-react"
import Link from "next/link"

interface ChatSession {
  id: string
  user_id?: string
  user_name?: string
  user_email?: string
  status: string
  created_at: string
  updated_at: string
  message_count: number
  last_message?: string
}

interface ChatMessage {
  id: string
  session_id: string
  sender: string
  message: string
  created_at: string
}

export function ChatContent() {
  const { toast } = useToast()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/admin/chat/sessions")
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch chat sessions",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chat sessions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (sessionId: string) => {
    setMessagesLoading(true)
    try {
      const response = await fetch(`/api/chat/messages?session_id=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      })
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleSessionClick = (session: ChatSession) => {
    setSelectedSession(session)
    fetchMessages(session.id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading chat sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat Management</h1>
            <p className="text-gray-600">View and manage customer chat sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat Sessions ({sessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSession?.id === session.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{session.user_name || session.user_email || "Anonymous"}</span>
                        </div>
                        <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {session.last_message && <p className="truncate">{session.last_message}</p>}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{session.message_count} messages</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(session.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No chat sessions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedSession
                  ? `Chat with ${selectedSession.user_name || selectedSession.user_email || "Anonymous"}`
                  : "Select a chat session"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSession ? (
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading messages...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg max-w-xs ${
                            message.sender === "user"
                              ? "bg-blue-100 text-blue-900 ml-auto"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(message.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages in this session</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a chat session to view messages</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
