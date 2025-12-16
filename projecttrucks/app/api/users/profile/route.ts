import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { updateUserSchema } from "@/lib/validators/user.validator"
import { sanitizeInput } from "@/lib/utils/format"

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        whatsapp: true,
        cpfCnpj: true,
        driverLicense: true,
        companyName: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)

  } catch (error: any) {
    if (error.message === "Não autorizado") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()

    const validatedData = updateUserSchema.parse(body)

    // Sanitize text inputs
    const sanitizedData: any = {}
    if (validatedData.name) {
      sanitizedData.name = sanitizeInput(validatedData.name)
    }
    if (validatedData.companyName) {
      sanitizedData.companyName = sanitizeInput(validatedData.companyName)
    }
    if (validatedData.phone) {
      sanitizedData.phone = validatedData.phone
    }
    if (validatedData.whatsapp) {
      sanitizedData.whatsapp = validatedData.whatsapp
    }
    if (validatedData.cpfCnpj) {
      sanitizedData.cpfCnpj = validatedData.cpfCnpj
    }
    if (validatedData.driverLicense) {
      sanitizedData.driverLicense = validatedData.driverLicense
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: sanitizedData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        whatsapp: true,
        cpfCnpj: true,
        driverLicense: true,
        companyName: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      message: "Perfil atualizado com sucesso",
      user: updatedUser
    })

  } catch (error: any) {
    console.error("Update profile error:", error)

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
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    )
  }
}
