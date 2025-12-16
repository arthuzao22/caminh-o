import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { createVehicleSchema } from "@/lib/validators/vehicle.validator"
import { UserRole } from "@prisma/client"
import { sanitizeInput } from "@/lib/utils/format"

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.DRIVER])
    const body = await req.json()

    const validatedData = createVehicleSchema.parse(body)

    // Check if plate already exists
    const existingPlate = await prisma.vehicle.findUnique({
      where: { plate: validatedData.plate }
    })

    if (existingPlate) {
      return NextResponse.json(
        { error: "Placa já cadastrada" },
        { status: 400 }
      )
    }

    const sanitizedData = {
      ...validatedData,
      brand: sanitizeInput(validatedData.brand),
      model: sanitizeInput(validatedData.model),
      description: validatedData.description ? sanitizeInput(validatedData.description) : undefined,
      userId: user.id,
    }

    const vehicle = await prisma.vehicle.create({
      data: sanitizedData,
      include: {
        photos: true
      }
    })

    return NextResponse.json(
      { message: "Veículo criado com sucesso", vehicle },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Create vehicle error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Apenas motoristas podem cadastrar veículos" },
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
      { error: "Erro ao criar veículo" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.DRIVER])

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: user.id },
      include: {
        photos: {
          orderBy: {
            isPrimary: 'desc'
          }
        },
        _count: {
          select: {
            availabilities: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ vehicles })

  } catch (error: any) {
    console.error("Get vehicles error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao buscar veículos" },
      { status: 500 }
    )
  }
}
