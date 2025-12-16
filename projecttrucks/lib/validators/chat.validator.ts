import { z } from "zod"

export const createChatSchema = z.object({
  participantId: z.string().cuid("ID de participante inválido"),
})

export const sendMessageSchema = z.object({
  chatId: z.string().cuid("ID de chat inválido"),
  content: z.string().min(1, "Mensagem não pode ser vazia").max(2000, "Mensagem muito longa"),
})

export type CreateChatInput = z.infer<typeof createChatSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
