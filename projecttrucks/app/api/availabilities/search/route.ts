import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { searchAvailabilitySchema } from "@/lib/validators/availability.validator"
import { AvailabilityStatus } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const queryParams = {
      originCity: searchParams.get('originCity') || undefined,
      originState: searchParams.get('originState') || undefined,
      destinationCity: searchParams.get('destinationCity') || undefined,
      destinationState: searchParams.get('destinationState') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      minCapacity: searchParams.get('minCapacity') ? Number(searchParams.get('minCapacity')) : undefined,
      vehicleType: searchParams.get('vehicleType') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    }

    const validatedParams = searchAvailabilitySchema.parse(queryParams)

    const where: any = {
      status: AvailabilityStatus.ACTIVE,
    }

    if (validatedParams.originCity) {
      where.originCity = {
        contains: validatedParams.originCity,
        mode: 'insensitive'
      }
    }

    if (validatedParams.originState) {
      where.originState = validatedParams.originState.toUpperCase()
    }

    if (validatedParams.destinationCity) {
      where.destinationCity = {
        contains: validatedParams.destinationCity,
        mode: 'insensitive'
      }
    }

    if (validatedParams.destinationState) {
      where.destinationState = validatedParams.destinationState.toUpperCase()
    }

    if (validatedParams.dateFrom || validatedParams.dateTo) {
      where.availableDate = {}
      if (validatedParams.dateFrom) {
        where.availableDate.gte = new Date(validatedParams.dateFrom)
      }
      if (validatedParams.dateTo) {
        where.availableDate.lte = new Date(validatedParams.dateTo)
      }
    } else {
      // Only show future availabilities if no date filter
      where.availableDate = {
        gte: new Date()
      }
    }

    if (validatedParams.minCapacity) {
      where.availableCapacity = {
        gte: validatedParams.minCapacity
      }
    }

    if (validatedParams.vehicleType) {
      where.vehicle = {
        type: validatedParams.vehicleType
      }
    }

    const skip = (validatedParams.page - 1) * validatedParams.limit

    const [availabilities, total] = await Promise.all([
      prisma.returnAvailability.findMany({
        where,
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
              companyName: true,
              whatsapp: true
            }
          }
        },
        orderBy: {
          availableDate: 'asc'
        },
        skip,
        take: validatedParams.limit
      }),
      prisma.returnAvailability.count({ where })
    ])

    return NextResponse.json({
      availabilities,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages: Math.ceil(total / validatedParams.limit)
      }
    })

  } catch (error: any) {
    console.error("Search availabilities error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Parâmetros de busca inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao buscar disponibilidades" },
      { status: 500 }
    )
  }
}
