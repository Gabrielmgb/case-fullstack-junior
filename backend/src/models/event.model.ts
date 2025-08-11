import { z } from "zod"

export const EventType = z.enum(["CONTRIBUTION", "WITHDRAWAL", "INCOME_CHANGE", "EXPENSE_CHANGE", "BONUS", "OTHER"])

export const EventFrequency = z.enum(["ONCE", "MONTHLY", "YEARLY"])

export const CreateEventSchema = z
  .object({
    title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
    description: z.string().optional(),
    type: EventType,
    value: z.number().refine((val) => val !== 0, "Valor não pode ser zero"),
    frequency: EventFrequency,
    startDate: z.string().datetime("Data de início inválida"),
    endDate: z.string().datetime("Data de fim inválida").optional(),
    isActive: z.boolean().optional().default(true),
    clientId: z.string().cuid("ID do cliente inválido"),
  })
  .refine(
    (data) => {
      if (data.endDate && data.frequency !== "ONCE") {
        return new Date(data.endDate) > new Date(data.startDate)
      }
      return true
    },
    {
      message: "Data de fim deve ser posterior à data de início",
    },
  )

export const UpdateEventSchema = CreateEventSchema.partial().omit({ clientId: true })

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type EventTypeType = z.infer<typeof EventType>
export type EventFrequencyType = z.infer<typeof EventFrequency>
