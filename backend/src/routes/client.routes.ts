import type { FastifyInstance } from "fastify"
import { ClientController } from "../controllers/client.controller"
import { ClientService } from "../services/client.service"
import { authenticate, authorize } from "../utils/auth"

export async function clientRoutes(fastify: FastifyInstance) {
  const clientService = new ClientService(fastify.prisma)
  const clientController = new ClientController(clientService)

  // All routes require authentication
  fastify.addHook("preHandler", authenticate)

  fastify.post(
    "/",
    {
      preHandler: [authorize(["ADVISOR"])],
      schema: {
        tags: ["Clients"],
        summary: "Criar novo cliente",
        security: [{ Bearer: [] }],
        body: {
          type: "object",
          required: ["name", "email", "age"],
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            age: { type: "integer", minimum: 0, maximum: 120 },
            isActive: { type: "boolean" },
            familyProfile: { type: "string" },
            totalWealth: { type: "number", minimum: 0 },
          },
        },
      },
    },
    clientController.create.bind(clientController),
  )

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Clients"],
        summary: "Listar clientes",
        security: [{ Bearer: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer", minimum: 1, maximum: 100 },
            search: { type: "string" },
            isActive: { type: "boolean" },
          },
        },
      },
    },
    clientController.findAll.bind(clientController),
  )

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Clients"],
        summary: "Obter cliente por ID",
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
    clientController.findById.bind(clientController),
  )

  fastify.put(
    "/:id",
    {
      preHandler: [authorize(["ADVISOR"])],
      schema: {
        tags: ["Clients"],
        summary: "Atualizar cliente",
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
    clientController.update.bind(clientController),
  )

  fastify.delete(
    "/:id",
    {
      preHandler: [authorize(["ADVISOR"])],
      schema: {
        tags: ["Clients"],
        summary: "Remover cliente",
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
    clientController.delete.bind(clientController),
  )

  fastify.get(
    "/:id/alignment",
    {
      schema: {
        tags: ["Clients"],
        summary: "Calcular alinhamento do cliente",
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
    clientController.getAlignment.bind(clientController),
  )
}
