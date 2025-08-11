import type { FastifyInstance } from "fastify"
import { SimulationController } from "../controllers/simulation.controller"
import { ProjectionService } from "../services/projection.service"
import { authenticate, authorize } from "../utils/auth"

export async function simulationRoutes(fastify: FastifyInstance) {
  const projectionService = new ProjectionService(fastify.prisma)
  const simulationController = new SimulationController(projectionService)

  // All routes require authentication
  fastify.addHook("preHandler", authenticate)

  fastify.post(
    "/",
    {
      preHandler: [authorize(["ADVISOR"])],
      schema: {
        tags: ["Simulations"],
        summary: "Criar nova simulação",
        security: [{ Bearer: [] }],
        body: {
          type: "object",
          required: ["title", "initialWealth", "projectionRate", "clientId"],
          properties: {
            title: { type: "string", minLength: 2 },
            description: { type: "string" },
            initialWealth: { type: "number", minimum: 0 },
            projectionRate: { type: "number", minimum: 0, maximum: 1 },
            clientId: { type: "string" },
          },
        },
      },
    },
    simulationController.create.bind(simulationController),
  )

  fastify.get(
    "/client/:clientId",
    {
      schema: {
        tags: ["Simulations"],
        summary: "Obter histórico de simulações do cliente",
        security: [{ Bearer: [] }],
        params: {
          type: "object",
          required: ["clientId"],
          properties: {
            clientId: { type: "string" },
          },
        },
      },
    },
    simulationController.getHistory.bind(simulationController),
  )

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Simulations"],
        summary: "Obter simulação por ID",
        security: [{ Bearer: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    simulationController.getById.bind(simulationController),
  )

  fastify.post(
    "/test",
    {
      schema: {
        tags: ["Simulations"],
        summary: "Testar motor de projeção (desenvolvimento)",
        security: [{ Bearer: [] }],
        body: {
          type: "object",
          properties: {
            initialWealth: { type: "number" },
            events: { type: "array" },
            projectionRate: { type: "number" },
            endYear: { type: "integer" },
          },
        },
      },
    },
    simulationController.testProjection.bind(simulationController),
  )
}
