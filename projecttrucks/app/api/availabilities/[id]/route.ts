import { NextRequest, NextResponse } from "next/server"
import { requireRole, getCurrentUser } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { updateAvailabilitySchema } from "@/lib/validators/availability.validator"
import { UserRole } from "@prisma/client"
import { sanitizeInput } from "@/lib/utils/format"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const availability = await prisma.returnAvailability.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            photos: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsapp: true,
            companyName: true,
            driverLicense: true
          }
        }
      }
    })

    if (!availability) {
      return NextResponse.json(
        { error: "Disponibilidade não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({ availability })

  } catch (error: any) {
    console.error("Get availability error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar disponibilidade" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireRole([UserRole.DRIVER])
    const body = await req.json()

    const validatedData = updateAvailabilitySchema.parse(body)

    // Check ownership
    const availability = await prisma.returnAvailability.findUnique({
      where: { id }
    })

    if (!availability) {
      return NextResponse.json(
        { error: "Disponibilidade não encontrada" },
        { status: 404 }
      )
    }

    if (availability.userId !== user.id) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    const sanitizedData: any = { ...validatedData }
    if (validatedData.originCity) {
      sanitizedData.originCity = sanitizeInput(validatedData.originCity)
    }
    if (validatedData.originState) {
      sanitizedData.originState = validatedData.originState.toUpperCase()
    }
    if (validatedData.destinationCity) {
      sanitizedData.destinationCity = sanitizeInput(validatedData.destinationCity)
    }
    if (validatedData.destinationState) {
      sanitizedData.destinationState = validatedData.destinationState.toUpperCase()
    }
    if (validatedData.description) {
      sanitizedData.description = sanitizeInput(validatedData.description)
    }
    if (validatedData.observations) {
      sanitizedData.observations = sanitizeInput(validatedData.observations)
    }
    if (validatedData.availableDate) {
      sanitizedData.availableDate = new Date(validatedData.availableDate)
    }

    const updatedAvailability = await prisma.returnAvailability.update({
      where: { id },
      data: sanitizedData,
      include: {
        vehicle: {
          include: {
            photos: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Disponibilidade atualizada com sucesso",
      availability: updatedAvailability
    })

  } catch (error: any) {
    console.error("Update availability error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao atualizar disponibilidade" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await requireRole([UserRole.DRIVER])

    // Check ownership
    const availability = await prisma.returnAvailability.findUnique({
      where: { id }
    })

    if (!availability) {
      return NextResponse.json(
        { error: "Disponibilidade não encontrada" },
        { status: 404 }
      )
    }

    if (availability.userId !== user.id) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    await prisma.returnAvailability.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Disponibilidade excluída com sucesso"
    })

  } catch (error: any) {
    console.error("Delete availability error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao excluir disponibilidade" },
      { status: 500 }
    )
  }
}
