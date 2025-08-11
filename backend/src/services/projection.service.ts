import type { PrismaClient } from "@prisma/client"
import type { WealthProjectionParams, ProjectionResult } from "../types"
import type { CreateSimulationInput } from "../models/simulation.model"
import { NotFoundError } from "../utils/errors"

export interface EventForProjection {
  value: number
  frequency: "ONCE" | "MONTHLY" | "YEARLY"
  startDate: Date
  endDate?: Date
}

export class ProjectionService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Motor de Projeção Patrimonial
   *
   * Suposições implementadas:
   * - Taxa real composta aplicada mensalmente: (1 + taxa_anual)^(1/12) - 1
   * - Movimentações aplicadas no início de cada período
   * - Eventos únicos aplicados apenas no ano especificado
   * - Eventos recorrentes aplicados conforme frequência até endDate ou 2060
   * - Capitalização mensal para maior precisão
   */
  simulateWealthCurve(params: WealthProjectionParams): ProjectionResult[] {
    const { initialWealth, events, projectionRate, endYear = 2060 } = params
    const currentYear = new Date().getFullYear()

    // Converte taxa anual para taxa mensal composta
    const monthlyRate = Math.pow(1 + projectionRate, 1 / 12) - 1

    const results: ProjectionResult[] = []
    let currentWealth = initialWealth

    // Simula mês a mês para maior precisão
    for (let year = currentYear; year <= endYear; year++) {
      const yearStartWealth = currentWealth

      for (let month = 0; month < 12; month++) {
        const currentDate = new Date(year, month, 1)

        // Aplica eventos no início do mês
        const monthlyEvents = this.getEventsForMonth(events, currentDate)
        const monthlyEventValue = monthlyEvents.reduce((sum, event) => sum + event.value, 0)

        // Aplica movimentação primeiro, depois crescimento
        currentWealth += monthlyEventValue
        currentWealth *= 1 + monthlyRate
      }

      results.push({
        year,
        projectedValue: Math.round(currentWealth * 100) / 100, // Arredonda para 2 casas decimais
      })
    }

    return results
  }

  private getEventsForMonth(events: EventForProjection[], currentDate: Date): EventForProjection[] {
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    return events.filter((event) => {
      const eventStartYear = event.startDate.getFullYear()
      const eventStartMonth = event.startDate.getMonth()
      const eventEndYear = event.endDate?.getFullYear() || 2060

      // Verifica se o evento está ativo neste período
      if (currentYear < eventStartYear || currentYear > eventEndYear) {
        return false
      }

      switch (event.frequency) {
        case "ONCE":
          // Evento único: apenas no ano e mês específicos
          return currentYear === eventStartYear && currentMonth === eventStartMonth

        case "YEARLY":
          // Evento anual: mesmo mês todos os anos
          return currentMonth === eventStartMonth

        case "MONTHLY":
          // Evento mensal: todos os meses
          return true

        default:
          return false
      }
    })
  }

  async createSimulation(data: CreateSimulationInput, userId: string) {
    // Verifica se o cliente pertence ao usuário
    const client = await this.prisma.client.findFirst({
      where: { id: data.clientId, userId },
      include: {
        events: {
          where: { isActive: true },
        },
      },
    })

    if (!client) {
      throw new NotFoundError("Cliente não encontrado")
    }

    // Converte eventos do banco para formato da projeção
    const events: EventForProjection[] = client.events.map((event) => ({
      value: Number(event.value),
      frequency: event.frequency as "ONCE" | "MONTHLY" | "YEARLY",
      startDate: event.startDate,
      endDate: event.endDate || undefined,
    }))

    // Executa a projeção
    const projectionData = this.simulateWealthCurve({
      initialWealth: data.initialWealth,
      events,
      projectionRate: data.projectionRate,
    })

    // Calcula score de alinhamento
    const alignmentScore = await this.calculateAlignmentScore(data.clientId, projectionData)

    // Gera sugestões automáticas
    const suggestions = await this.generateSuggestions(data.clientId, projectionData, alignmentScore)

    // Salva a simulação
    const simulation = await this.prisma.simulation.create({
      data: {
        title: data.title,
        description: data.description,
        initialWealth: data.initialWealth,
        projectionRate: data.projectionRate,
        projectionData: projectionData,
        alignmentScore,
        suggestions,
        clientId: data.clientId,
      },
    })

    return simulation
  }

  private async calculateAlignmentScore(clientId: string, projectionData: ProjectionResult[]): Promise<number> {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { goals: true },
    })

    if (!client || client.goals.length === 0) {
      return 0
    }

    // Encontra a meta mais próxima no tempo
    const nearestGoal = client.goals.reduce((nearest, goal) => {
      const goalYear = goal.targetDate.getFullYear()
      const nearestYear = nearest.targetDate.getFullYear()
      const currentYear = new Date().getFullYear()

      const goalDistance = Math.abs(goalYear - currentYear)
      const nearestDistance = Math.abs(nearestYear - currentYear)

      return goalDistance < nearestDistance ? goal : nearest
    })

    const goalYear = nearestGoal.targetDate.getFullYear()
    const projectedValueAtGoal = projectionData.find((p) => p.year === goalYear)?.projectedValue || 0
    const targetValue = Number(nearestGoal.targetValue)

    if (targetValue === 0) return 0

    const alignmentScore = (projectedValueAtGoal / targetValue) * 100
    return Math.min(alignmentScore, 100) // Cap at 100%
  }

  private async generateSuggestions(clientId: string, projectionData: ProjectionResult[], alignmentScore: number) {
    const suggestions = []

    if (alignmentScore < 90) {
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
        include: { goals: true },
      })

      if (client && client.goals.length > 0) {
        const primaryGoal = client.goals[0] // Assume primeira meta como principal
        const goalYear = primaryGoal.targetDate.getFullYear()
        const currentYear = new Date().getFullYear()
        const yearsRemaining = goalYear - currentYear

        const projectedValue = projectionData.find((p) => p.year === goalYear)?.projectedValue || 0
        const targetValue = Number(primaryGoal.targetValue)
        const gap = targetValue - projectedValue

        if (gap > 0 && yearsRemaining > 0) {
          // Calcula aporte mensal necessário para fechar o gap
          const monthsRemaining = yearsRemaining * 12
          const monthlyContribution = gap / monthsRemaining

          suggestions.push({
            type: "INCREASE_CONTRIBUTION",
            description: `Aumente a contribuição mensal em R$ ${monthlyContribution.toFixed(2)} para atingir sua meta`,
            impact: gap,
            priority: alignmentScore < 50 ? 1 : 2,
          })
        }

        if (alignmentScore < 70) {
          suggestions.push({
            type: "REVIEW_STRATEGY",
            description: "Considere revisar sua estratégia de investimento para melhorar o alinhamento",
            priority: 1,
          })
        }

        if (yearsRemaining < 5 && alignmentScore < 80) {
          suggestions.push({
            type: "URGENT_ACTION",
            description: "Meta próxima com baixo alinhamento. Ação urgente necessária",
            priority: 1,
          })
        }
      }
    }

    return suggestions
  }

  async getSimulationHistory(clientId: string, userId: string) {
    // Verifica se o cliente pertence ao usuário
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, userId },
    })

    if (!client) {
      throw new NotFoundError("Cliente não encontrado")
    }

    return await this.prisma.simulation.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        initialWealth: true,
        projectionRate: true,
        alignmentScore: true,
        createdAt: true,
      },
    })
  }

  async getSimulationById(id: string, userId: string) {
    const simulation = await this.prisma.simulation.findFirst({
      where: {
        id,
        client: { userId },
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!simulation) {
      throw new NotFoundError("Simulação não encontrada")
    }

    return simulation
  }
}
