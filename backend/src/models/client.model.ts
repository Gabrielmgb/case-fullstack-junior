import { z } from "zod"

export const CreateClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().int().min(0).max(120, "Idade deve estar entre 0 e 120 anos"),
  isActive: z.boolean().optional().default(true),
  familyProfile: z.string().optional(),
  totalWealth: z.number().min(0, "Patrimônio deve ser positivo").optional().default(0),
})

export const UpdateClientSchema = CreateClientSchema.partial()

export const ClientQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type CreateClientInput = z.infer<typeof CreateClientSchema>
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>
export type ClientQueryInput = z.infer<typeof ClientQuerySchema>
