import { z } from "zod"

export const CreateWalletItemSchema = z.object({
  assetClass: z.string().min(2, "Classe do ativo deve ter pelo menos 2 caracteres"),
  percentage: z.number().min(0).max(100, "Percentual deve estar entre 0 e 100"),
  value: z.number().min(0, "Valor deve ser positivo"),
  clientId: z.string().cuid("ID do cliente inválido"),
})

export const UpdateWalletItemSchema = CreateWalletItemSchema.partial().omit({ clientId: true })

export const WalletValidationSchema = z
  .object({
    items: z.array(CreateWalletItemSchema),
  })
  .refine(
    (data) => {
      const totalPercentage = data.items.reduce((sum, item) => sum + item.percentage, 0)
      return Math.abs(totalPercentage - 100) < 0.01 // Permite pequena margem de erro
    },
    {
      message: "A soma dos percentuais deve ser 100%",
    },
  )

export type CreateWalletItemInput = z.infer<typeof CreateWalletItemSchema>
export type UpdateWalletItemInput = z.infer<typeof UpdateWalletItemSchema>
export type WalletValidationInput = z.infer<typeof WalletValidationSchema>
