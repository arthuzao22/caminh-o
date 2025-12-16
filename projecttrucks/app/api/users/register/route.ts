import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validators/user.validator"
import { sanitizeInput } from "@/lib/utils/format"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    // Check CPF/CNPJ uniqueness if provided
    if (validatedData.cpfCnpj) {
      const existingCpfCnpj = await prisma.user.findUnique({
        where: { cpfCnpj: validatedData.cpfCnpj }
      })

      if (existingCpfCnpj) {
        return NextResponse.json(
          { error: "CPF/CNPJ já cadastrado" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Sanitize text inputs
    const sanitizedData = {
      ...validatedData,
      name: sanitizeInput(validatedData.name),
      companyName: validatedData.companyName ? sanitizeInput(validatedData.companyName) : undefined,
      password: hashedPassword,
    }

    // Create user
    const user = await prisma.user.create({
      data: sanitizedData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { message: "Usuário criado com sucesso", user },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Registration error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    )
  }
}
