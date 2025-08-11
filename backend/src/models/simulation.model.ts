import { z } from "zod"

export const ProjectionDataSchema = z.object({
  year: z.number().int(),
  projectedValue: z.number(),
})

export const SuggestionSchema = z.object({
  type: z.string(),
  description: z.string(),
  impact: z.number().optional(),
  priority: z.number().int().min(1).max(3).optional().default(2),
})

export const CreateSimulationSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  initialWealth: z.number().min(0, "Patrimônio inicial deve ser positivo"),
  projectionRate: z.number().min(0).max(1, "Taxa deve estar entre 0 e 1"),
  clientId: z.string().cuid("ID do cliente inválido"),
})

export const SimulationResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  initialWealth: z.number(),
  projectionRate: z.number(),
  projectionData: z.array(ProjectionDataSchema),
  alignmentScore: z.number().nullable(),
  suggestions: z.array(SuggestionSchema).nullable(),
  createdAt: z.date(),
})

export type CreateSimulationInput = z.infer<typeof CreateSimulationSchema>
export type ProjectionData = z.infer<typeof ProjectionDataSchema>
export type Suggestion = z.infer<typeof SuggestionSchema>
export type SimulationResult = z.infer<typeof SimulationResultSchema>
