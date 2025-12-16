import { z } from "zod"
import { UserRole } from "@prisma/client"

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  whatsapp: z.string().optional(),
  cpfCnpj: z.string().optional(),
  driverLicense: z.string().optional(),
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.role === UserRole.DRIVER && !data.driverLicense) {
    return false
  }
  return true
}, {
  message: "Motoristas devem informar a CNH",
  path: ["driverLicense"]
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  cpfCnpj: z.string().optional(),
  driverLicense: z.string().optional(),
  companyName: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
