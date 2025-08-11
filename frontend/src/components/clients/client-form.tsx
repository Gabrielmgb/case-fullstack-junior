"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { Client, ClientForm as ClientFormType } from "@/types"

const clientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.number().int().min(0).max(120, "Idade deve estar entre 0 e 120 anos"),
  isActive: z.boolean().optional().default(true),
  familyProfile: z.string().optional(),
  totalWealth: z.number().min(0, "Patrimônio deve ser positivo").optional().default(0),
})

interface ClientFormProps {
  client?: Client
  onSubmit: (data: ClientFormType) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClientFormType>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          name: client.name,
          email: client.email,
          age: client.age,
          isActive: client.isActive,
          familyProfile: client.familyProfile || "",
          totalWealth: client.totalWealth,
        }
      : {
          isActive: true,
          totalWealth: 0,
        },
  })

  const isActive = watch("isActive")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" placeholder="Nome completo do cliente" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Idade *</Label>
          <Input
            id="age"
            type="number"
            min="0"
            max="120"
            placeholder="35"
            {...register("age", { valueAsNumber: true })}
          />
          {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalWealth">Patrimônio Total (R$)</Label>
          <Input
            id="totalWealth"
            type="number"
            min="0"
            step="0.01"
            placeholder="100000.00"
            {...register("totalWealth", { valueAsNumber: true })}
          />
          {errors.totalWealth && <p className="text-sm text-destructive">{errors.totalWealth.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="familyProfile">Perfil Familiar</Label>
        <Textarea
          id="familyProfile"
          placeholder="Ex: Casado, 2 filhos menores, cônjuge trabalha..."
          {...register("familyProfile")}
        />
        {errors.familyProfile && <p className="text-sm text-destructive">{errors.familyProfile.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
        <Label htmlFor="isActive">Cliente ativo</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : client ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}
