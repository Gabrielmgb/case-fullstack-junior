import { z } from "zod"

export const UserRole = z.enum(["ADVISOR", "VIEWER"])

export const CreateUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: UserRole.optional().default("ADVISOR"),
})

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true })

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type UserRoleType = z.infer<typeof UserRole>
