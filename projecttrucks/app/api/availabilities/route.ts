import { NextRequest, NextResponse } from "next/server"
import { requireRole, getCurrentUser } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { createAvailabilitySchema } from "@/lib/validators/availability.validator"
import { UserRole, AvailabilityStatus } from "@prisma/client"
import { sanitizeInput } from "@/lib/utils/format"

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.DRIVER])
    const body = await req.json()

    const validatedData = createAvailabilitySchema.parse(body)

    // Verify vehicle ownership
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: validatedData.vehicleId }
    })

    if (!vehicle || vehicle.userId !== user.id) {
      return NextResponse.json(
        { error: "Veículo não encontrado ou sem permissão" },
        { status: 403 }
      )
    }

    const sanitizedData = {
      ...validatedData,
      originCity: sanitizeInput(validatedData.originCity),
      originState: validatedData.originState.toUpperCase(),
      destinationCity: sanitizeInput(validatedData.destinationCity),
      destinationState: validatedData.destinationState.toUpperCase(),
      description: validatedData.description ? sanitizeInput(validatedData.description) : undefined,
      observations: validatedData.observations ? sanitizeInput(validatedData.observations) : undefined,
      availableDate: new Date(validatedData.availableDate),
      userId: user.id,
    }

    const availability = await prisma.returnAvailability.create({
      data: sanitizedData,
      include: {
        vehicle: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1
            }
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

    return NextResponse.json(
      { message: "Disponibilidade criada com sucesso", availability },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Create availability error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Apenas motoristas podem criar disponibilidades" },
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
      { error: "Erro ao criar disponibilidade" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    let availabilities

    if (user.role === UserRole.DRIVER) {
      // Driver sees their own availabilities
      availabilities = await prisma.returnAvailability.findMany({
        where: { userId: user.id },
        include: {
          vehicle: {
            include: {
              photos: {
                where: { isPrimary: true },
                take: 1
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Clients see all active availabilities
      availabilities = await prisma.returnAvailability.findMany({
        where: { 
          status: AvailabilityStatus.ACTIVE,
          availableDate: {
            gte: new Date()
          }
        },
        include: {
          vehicle: {
            include: {
              photos: {
                where: { isPrimary: true },
                take: 1
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              companyName: true
            }
          }
        },
        orderBy: {
          availableDate: 'asc'
        },
        take: 50
      })
    }

    return NextResponse.json({ availabilities })

  } catch (error: any) {
    console.error("Get availabilities error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar disponibilidades" },
      { status: 500 }
    )
  }
}
