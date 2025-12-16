import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "vehicles")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.DRIVER])
    
    const formData = await req.formData()
    const file = formData.get("file") as File
    const vehicleId = formData.get("vehicleId") as string
    const isPrimary = formData.get("isPrimary") === "true"

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      )
    }

    if (!vehicleId) {
      return NextResponse.json(
        { error: "ID do veículo é obrigatório" },
        { status: 400 }
      )
    }

    // Verify vehicle ownership
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle || vehicle.userId !== user.id) {
      return NextResponse.json(
        { error: "Veículo não encontrado ou sem permissão" },
        { status: 403 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPEG, PNG ou WebP" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Tamanho máximo: 5MB" },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${vehicleId}-${timestamp}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Save to database
    const url = `/uploads/vehicles/${filename}`

    // If this is marked as primary, unmark others
    if (isPrimary) {
      await prisma.vehiclePhoto.updateMany({
        where: { vehicleId },
        data: { isPrimary: false }
      })
    }

    const photo = await prisma.vehiclePhoto.create({
      data: {
        vehicleId,
        url,
        isPrimary
      }
    })

    return NextResponse.json({
      message: "Foto enviada com sucesso",
      photo
    })

  } catch (error: any) {
    console.error("Upload error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao fazer upload da foto" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireRole([UserRole.DRIVER])
    const { searchParams } = new URL(req.url)
    const photoId = searchParams.get("id")

    if (!photoId) {
      return NextResponse.json(
        { error: "ID da foto é obrigatório" },
        { status: 400 }
      )
    }

    const photo = await prisma.vehiclePhoto.findUnique({
      where: { id: photoId },
      include: {
        vehicle: true
      }
    })

    if (!photo) {
      return NextResponse.json(
        { error: "Foto não encontrada" },
        { status: 404 }
      )
    }

    if (photo.vehicle.userId !== user.id) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    await prisma.vehiclePhoto.delete({
      where: { id: photoId }
    })

    return NextResponse.json({
      message: "Foto excluída com sucesso"
    })

  } catch (error: any) {
    console.error("Delete photo error:", error)

    if (error.message?.includes("Acesso negado")) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao excluir foto" },
      { status: 500 }
    )
  }
}
