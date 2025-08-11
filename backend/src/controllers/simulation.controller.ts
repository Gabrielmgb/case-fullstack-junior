import type { FastifyRequest, FastifyReply } from "fastify"
import type { ProjectionService } from "../services/projection.service"
import { CreateSimulationSchema } from "../models/simulation.model"
import { ValidationError } from "../utils/errors"

export class SimulationController {
  constructor(private projectionService: ProjectionService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = CreateSimulationSchema.parse(request.body)
      const simulation = await this.projectionService.createSimulation(data, request.user!.userId)

      reply.status(201).send(simulation)
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new ValidationError(error.errors[0].message)
      }
      throw error
    }
  }

  async getHistory(request: FastifyRequest<{ Params: { clientId: string } }>, reply: FastifyReply) {
    const history = await this.projectionService.getSimulationHistory(request.params.clientId, request.user!.userId)
    reply.send(history)
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const simulation = await this.projectionService.getSimulationById(request.params.id, request.user!.userId)
    reply.send(simulation)
  }

  async testProjection(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { initialWealth, events, projectionRate, endYear } = request.body as any

      const projectionData = this.projectionService.simulateWealthCurve({
        initialWealth: initialWealth || 100000,
        events: events || [],
        projectionRate: projectionRate || 0.04,
        endYear: endYear || 2060,
      })

      reply.send({
        projectionData,
        summary: {
          initialWealth: initialWealth || 100000,
          finalValue: projectionData[projectionData.length - 1]?.projectedValue || 0,
          totalGrowth: (projectionData[projectionData.length - 1]?.projectedValue || 0) - (initialWealth || 100000),
          yearsProjected: projectionData.length,
        },
      })
    } catch (error: any) {
      throw new ValidationError("Parâmetros inválidos para teste de projeção")
    }
  }
}
