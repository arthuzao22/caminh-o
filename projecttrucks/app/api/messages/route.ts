import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { sendMessageSchema } from "@/lib/validators/chat.validator"
import { sanitizeInput } from "@/lib/utils/format"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()

    const validatedData = sendMessageSchema.parse(body)

    // Verify user is part of the chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: validatedData.chatId,
        OR: [
          { participant1Id: user.id },
          { participant2Id: user.id }
        ]
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: "Chat não encontrado ou acesso negado" },
        { status: 404 }
      )
    }

    const message = await prisma.message.create({
      data: {
        chatId: validatedData.chatId,
        senderId: user.id,
        content: sanitizeInput(validatedData.content)
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Update chat's updatedAt
    await prisma.chat.update({
      where: { id: validatedData.chatId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(
      { message: "Mensagem enviada com sucesso", data: message },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Send message error:", error)

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
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    )
  }
}
