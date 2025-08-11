import { z } from "zod"

export const GoalType = z.enum([
  "RETIREMENT",
  "SHORT_TERM",
  "MEDIUM_TERM",
  "LONG_TERM",
  "EMERGENCY_FUND",
  "EDUCATION",
  "REAL_ESTATE",
  "OTHER",
])

export const CreateGoalSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  type: GoalType,
  targetValue: z.number().positive("Valor meta deve ser positivo"),
  targetDate: z.string().datetime("Data inválida"),
  priority: z.number().int().min(1).max(3).optional().default(1),
  clientId: z.string().cuid("ID do cliente inválido"),
})

export const UpdateGoalSchema = CreateGoalSchema.partial().omit({ clientId: true })

export type CreateGoalInput = z.infer<typeof CreateGoalSchema>
export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>
export type GoalTypeType = z.infer<typeof GoalType>
