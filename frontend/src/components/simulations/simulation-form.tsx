"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClients } from "@/hooks/use-clients"
import type { SimulationForm as SimulationFormType } from "@/types"

const simulationSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  initialWealth: z.number().min(0, "Patrimônio inicial deve ser positivo"),
  projectionRate: z.number().min(0).max(1, "Taxa deve estar entre 0 e 1"),
  clientId: z.string().min(1, "Cliente é obrigatório"),
})

interface SimulationFormProps {
  onSubmit: (data: SimulationFormType) => void
  onCancel: () => void
  isLoading?: boolean
}

export function SimulationForm({ onSubmit, onCancel, isLoading }: SimulationFormProps) {
  const { data: clientsData } = useClients({ limit: 100 })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SimulationFormType>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      projectionRate: 0.04, // 4% padrão
    },
  })

  const selectedClientId = watch("clientId")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Simulação *</Label>
        <Input id="title" placeholder="Ex: Projeção para aposentadoria 2050" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descreva os objetivos e premissas desta simulação..."
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente *</Label>
          <Select onValueChange={(value) => setValue("clientId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientsData?.data.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clientId && <p className="text-sm text-destructive">{errors.clientId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="initialWealth">Patrimônio Inicial (R$) *</Label>
          <Input
            id="initialWealth"
            type="number"
            min="0"
            step="0.01"
            placeholder="100000.00"
            {...register("initialWealth", { valueAsNumber: true })}
          />
          {errors.initialWealth && <p className="text-sm text-destructive">{errors.initialWealth.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectionRate">Taxa de Projeção Anual *</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="projectionRate"
            type="number"
            min="0"
            max="1"
            step="0.001"
            placeholder="0.04"
            {...register("projectionRate", { valueAsNumber: true })}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">
            {((watch("projectionRate") || 0) * 100).toFixed(1)}% a.a.
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Taxa real composta anual (ex: 0.04 = 4% ao ano)</p>
        {errors.projectionRate && <p className="text-sm text-destructive">{errors.projectionRate.message}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Simulação"}
        </Button>
      </div>
    </form>
  )
}
