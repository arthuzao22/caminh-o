import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { updateVehicleSchema } from "@/lib/validators/vehicle.validator"
import { UserRole } from "@prisma/client"
import { sanitizeInput } from "@/lib/utils/format"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: {
            isPrimary: 'desc'
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsapp: true,
            companyName: true
          }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ vehicle })

  } catch (error: any) {
    console.error("Get vehicle error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar veículo" },
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

    const validatedData = updateVehicleSchema.parse(body)

    // Check ownership
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      )
    }

    if (vehicle.userId !== user.id) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    // Check plate uniqueness if changing
    if (validatedData.plate && validatedData.plate !== vehicle.plate) {
      const existingPlate = await prisma.vehicle.findUnique({
        where: { plate: validatedData.plate }
      })

      if (existingPlate) {
        return NextResponse.json(
          { error: "Placa já cadastrada" },
          { status: 400 }
        )
      }
    }

    const sanitizedData: any = { ...validatedData }
    if (validatedData.brand) {
      sanitizedData.brand = sanitizeInput(validatedData.brand)
    }
    if (validatedData.model) {
      sanitizedData.model = sanitizeInput(validatedData.model)
    }
    if (validatedData.description) {
      sanitizedData.description = sanitizeInput(validatedData.description)
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: sanitizedData,
      include: {
        photos: true
      }
    })

    return NextResponse.json({
      message: "Veículo atualizado com sucesso",
      vehicle: updatedVehicle
    })

  } catch (error: any) {
    console.error("Update vehicle error:", error)

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
      { error: "Erro ao atualizar veículo" },
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
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      )
    }

    if (vehicle.userId !== user.id) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    await prisma.vehicle.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Veículo excluído com sucesso"
    })

  } catch (error: any) {
    console.error("Delete vehicle error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao excluir veículo" },
      { status: 500 }
    )
  }
}
