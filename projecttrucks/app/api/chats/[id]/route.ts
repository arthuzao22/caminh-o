import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireAuth()

    // Verify user is part of the chat
    const chat = await prisma.chat.findFirst({
      where: {
        id,
        OR: [
          { participant1Id: user.id },
          { participant2Id: user.id }
        ]
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            role: true,
            companyName: true
          }
        },
        participant2: {
          select: {
            id: true,
            name: true,
            role: true,
            companyName: true
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: "Chat não encontrado ou acesso negado" },
        { status: 404 }
      )
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        chatId: id,
        senderId: { not: user.id },
        read: false
      },
      data: {
        read: true
      }
    })

    return NextResponse.json({ chat })

  } catch (error: any) {
    console.error("Get chat error:", error)

    if (error.message === "Não autorizado") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao buscar chat" },
      { status: 500 }
    )
  }
}
