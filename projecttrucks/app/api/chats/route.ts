import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { createChatSchema } from "@/lib/validators/chat.validator"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()

    const validatedData = createChatSchema.parse(body)

    // Check if chat already exists between these users
    const existingChat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            participant1Id: user.id,
            participant2Id: validatedData.participantId
          },
          {
            participant1Id: validatedData.participantId,
            participant2Id: user.id
          }
        ]
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        participant2: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    if (existingChat) {
      return NextResponse.json({ chat: existingChat })
    }

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        participant1Id: user.id,
        participant2Id: validatedData.participantId
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        participant2: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: "Chat criado com sucesso", chat },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Create chat error:", error)

    if (error.message === "Não autorizado") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao criar chat" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()

    const chats = await prisma.chat.findMany({
      where: {
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
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({ chats })

  } catch (error: any) {
    console.error("Get chats error:", error)

    if (error.message === "Não autorizado") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao buscar chats" },
      { status: 500 }
    )
  }
}
