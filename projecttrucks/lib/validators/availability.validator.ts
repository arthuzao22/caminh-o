import { z } from "zod"
import { AvailabilityStatus } from "@prisma/client"

export const createAvailabilitySchema = z.object({
  vehicleId: z.string().cuid(),
  originCity: z.string().min(2, "Cidade de origem inválida"),
  originState: z.string().length(2, "Estado deve ter 2 caracteres (UF)"),
  destinationCity: z.string().min(2, "Cidade de destino inválida"),
  destinationState: z.string().length(2, "Estado deve ter 2 caracteres (UF)"),
  availableDate: z.string().or(z.date()),
  flexibleDates: z.boolean().default(false),
  availableCapacity: z.number().positive("Capacidade disponível deve ser positiva"),
  priceEstimate: z.number().positive().optional(),
  description: z.string().optional(),
  observations: z.string().optional(),
})

export const updateAvailabilitySchema = z.object({
  originCity: z.string().min(2).optional(),
  originState: z.string().length(2).optional(),
  destinationCity: z.string().min(2).optional(),
  destinationState: z.string().length(2).optional(),
  availableDate: z.string().or(z.date()).optional(),
  flexibleDates: z.boolean().optional(),
  availableCapacity: z.number().positive().optional(),
  priceEstimate: z.number().positive().optional(),
  description: z.string().optional(),
  observations: z.string().optional(),
  status: z.nativeEnum(AvailabilityStatus).optional(),
})

export const searchAvailabilitySchema = z.object({
  originCity: z.string().optional(),
  originState: z.string().optional(),
  destinationCity: z.string().optional(),
  destinationState: z.string().optional(),
  dateFrom: z.string().or(z.date()).optional(),
  dateTo: z.string().or(z.date()).optional(),
  minCapacity: z.number().optional(),
  vehicleType: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
})

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>
export type SearchAvailabilityInput = z.infer<typeof searchAvailabilitySchema>
