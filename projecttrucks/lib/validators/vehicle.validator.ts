import { z } from "zod"
import { VehicleType } from "@prisma/client"

export const createVehicleSchema = z.object({
  type: z.nativeEnum(VehicleType),
  brand: z.string().min(2, "Marca deve ter no mínimo 2 caracteres"),
  model: z.string().min(2, "Modelo deve ter no mínimo 2 caracteres"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(7, "Placa inválida"),
  capacity: z.number().positive("Capacidade deve ser positiva"),
  description: z.string().optional(),
})

export const updateVehicleSchema = z.object({
  type: z.nativeEnum(VehicleType).optional(),
  brand: z.string().min(2).optional(),
  model: z.string().min(2).optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  plate: z.string().min(7).optional(),
  capacity: z.number().positive().optional(),
  description: z.string().optional(),
})

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>
