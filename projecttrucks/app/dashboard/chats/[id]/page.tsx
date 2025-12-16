"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string
  }
}

type Chat = {
  id: string
  participant1: {
    id: string
    name: string
    role: string
    companyName?: string
  }
  participant2: {
    id: string
    name: string
    role: string
    companyName?: string
  }
  messages: Message[]
}

export default function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [chatId, setChatId] = useState<string>("")
  const [chat, setChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(p => setChatId(p.id))
  }, [params])

  useEffect(() => {
    if (chatId) {
      fetchChat()
    }
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const fetchChat = async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      const data = await response.json()

      if (response.ok) {
        setChat(data.chat)
      } else {
        router.push("/dashboard/chats")
      }
    } catch (error) {
      console.error("Error fetching chat:", error)
      router.push("/dashboard/chats")
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          content: message
        })
      })

      if (response.ok) {
        setMessage("")
        await fetchChat()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const getOtherParticipant = () => {
    if (!chat) return null
    return chat.participant1.id === session?.user?.id
      ? chat.participant2
      : chat.participant1
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-lg text-gray-600">Carregando conversa...</div>
      </div>
    )
  }

  if (!chat) {
    return null
  }

  const otherParticipant = getOtherParticipant()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white rounded-t-lg shadow p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {otherParticipant?.companyName || otherParticipant?.name}
            </h2>
            <p className="text-sm text-gray-600">
              {otherParticipant?.role === "DRIVER" ? "Motorista" : "Cliente"}
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/chats")}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Voltar
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-50 p-6 h-[500px] overflow-y-auto">
        {chat.messages.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            Nenhuma mensagem ainda. Envie a primeira!
          </div>
        ) : (
          <div className="space-y-4">
            {chat.messages.map((msg) => {
              const isOwnMessage = msg.sender.id === session?.user?.id

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                      isOwnMessage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 shadow"
                    }`}
                  >
                    <p className="text-sm mb-1">{msg.content}</p>
                    <p
                      className={`text-xs ${
                        isOwnMessage ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white rounded-b-lg shadow p-6 border-t"
      >
        <div className="flex gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  )
}
