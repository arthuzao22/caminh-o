"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

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
  messages: Array<{
    id: string
    content: string
    createdAt: string
  }>
  updatedAt: string
}

export default function ChatsPage() {
  const { data: session } = useSession()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats")
      const data = await response.json()

      if (response.ok) {
        setChats(data.chats)
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getOtherParticipant = (chat: Chat) => {
    return chat.participant1.id === session?.user?.id
      ? chat.participant2
      : chat.participant1
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-lg text-gray-600">Carregando conversas...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mensagens</h1>

      {chats.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">Você ainda não tem conversas.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {chats.map((chat) => {
            const otherParticipant = getOtherParticipant(chat)
            const lastMessage = chat.messages[0]

            return (
              <Link
                key={chat.id}
                href={`/dashboard/chats/${chat.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {otherParticipant.companyName || otherParticipant.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {otherParticipant.role === "DRIVER" ? "Motorista" : "Cliente"}
                    </p>
                    {lastMessage && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    {formatDate(chat.updatedAt)}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
