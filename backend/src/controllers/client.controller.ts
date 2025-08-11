import type { FastifyRequest, FastifyReply } from "fastify"
import type { ClientService } from "../services/client.service"
import { CreateClientSchema, UpdateClientSchema, ClientQuerySchema } from "../models/client.model"
import { ValidationError } from "../utils/errors"

export class ClientController {
  constructor(private clientService: ClientService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = CreateClientSchema.parse(request.body)
      const client = await this.clientService.create(data, request.user!.userId)

      reply.status(201).send(client)
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new ValidationError(error.errors[0].message)
      }
      throw error
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = ClientQuerySchema.parse(request.query)
      const clients = await this.clientService.findAll(query, request.user!.userId)

      reply.send(clients)
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new ValidationError(error.errors[0].message)
      }
      throw error
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const client = await this.clientService.findById(request.params.id, request.user!.userId)
    reply.send(client)
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const data = UpdateClientSchema.parse(request.body)
      const client = await this.clientService.update(request.params.id, data, request.user!.userId)

      reply.send(client)
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new ValidationError(error.errors[0].message)
      }
      throw error
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const result = await this.clientService.delete(request.params.id, request.user!.userId)
    reply.send(result)
  }

  async getAlignment(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const alignmentScore = await this.clientService.calculateAlignment(request.params.id, request.user!.userId)

    let category = "red"
    if (alignmentScore > 90) category = "green"
    else if (alignmentScore > 70) category = "yellow-light"
    else if (alignmentScore > 50) category = "yellow-dark"

    reply.send({
      clientId: request.params.id,
      alignmentScore: Math.round(alignmentScore * 100) / 100,
      category,
    })
  }
}
