import { z } from "zod"

export const InsuranceType = z.enum(["LIFE", "DISABILITY", "HEALTH", "PROPERTY", "OTHER"])
export const PaymentFrequency = z.enum(["MONTHLY", "YEARLY"])

export const CreateInsuranceSchema = z
  .object({
    type: InsuranceType,
    coverage: z.number().positive("Cobertura deve ser positiva"),
    premium: z.number().positive("Prêmio deve ser positivo"),
    frequency: PaymentFrequency,
    provider: z.string().min(2, "Seguradora deve ter pelo menos 2 caracteres"),
    policyNumber: z.string().optional(),
    startDate: z.string().datetime("Data de início inválida"),
    endDate: z.string().datetime("Data de fim inválida").optional(),
    isActive: z.boolean().optional().default(true),
    clientId: z.string().cuid("ID do cliente inválido"),
  })
  .refine(
    (data) => {
      if (data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate)
      }
      return true
    },
    {
      message: "Data de fim deve ser posterior à data de início",
    },
  )

export const UpdateInsuranceSchema = CreateInsuranceSchema.partial().omit({ clientId: true })

export type CreateInsuranceInput = z.infer<typeof CreateInsuranceSchema>
export type UpdateInsuranceInput = z.infer<typeof UpdateInsuranceSchema>
export type InsuranceTypeType = z.infer<typeof InsuranceType>
export type PaymentFrequencyType = z.infer<typeof PaymentFrequency>
