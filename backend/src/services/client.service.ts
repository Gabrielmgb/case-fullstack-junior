import type { PrismaClient } from "@prisma/client"
import type { CreateClientInput, UpdateClientInput, ClientQueryInput } from "../models/client.model"
import { NotFoundError } from "../utils/errors"
import { calculatePagination, createPaginatedResponse } from "../utils/pagination"

export class ClientService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateClientInput, userId: string) {
    return await this.prisma.client.create({
      data: {
        ...data,
        userId,
      },
      include: {
        goals: true,
        walletItems: true,
        _count: {
          select: {
            goals: true,
            walletItems: true,
            events: true,
            simulations: true,
          },
        },
      },
    })
  }

  async findAll(query: ClientQueryInput, userId: string) {
    const { page, limit, search, isActive } = query

    const where = {
      userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(isActive !== undefined && { isActive }),
    }

    const total = await this.prisma.client.count({ where })
    const { skip, take, pagination } = calculatePagination(page, limit, total)

    const clients = await this.prisma.client.findMany({
      where,
      skip,
      take,
      include: {
        goals: true,
        walletItems: true,
        _count: {
          select: {
            goals: true,
            walletItems: true,
            events: true,
            simulations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return createPaginatedResponse(clients, pagination)
  }

  async findById(id: string, userId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
      include: {
        goals: true,
        walletItems: true,
        events: true,
        simulations: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        insurances: true,
        _count: {
          select: {
            goals: true,
            walletItems: true,
            events: true,
            simulations: true,
            insurances: true,
          },
        },
      },
    })

    if (!client) {
      throw new NotFoundError("Cliente não encontrado")
    }

    return client
  }

  async update(id: string, data: UpdateClientInput, userId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
    })

    if (!client) {
      throw new NotFoundError("Cliente não encontrado")
    }

    return await this.prisma.client.update({
      where: { id },
      data,
      include: {
        goals: true,
        walletItems: true,
        _count: {
          select: {
            goals: true,
            walletItems: true,
            events: true,
            simulations: true,
          },
        },
      },
    })
  }

  async delete(id: string, userId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
    })

    if (!client) {
      throw new NotFoundError("Cliente não encontrado")
    }

    await this.prisma.client.delete({
      where: { id },
    })

    return { message: "Cliente removido com sucesso" }
  }

  async calculateAlignment(clientId: string, userId: string) {
    const client = await this.findById(clientId, userId)

    const totalGoalValue = client.goals.reduce((sum, goal) => sum + Number(goal.targetValue), 0)
    const totalWalletValue = client.walletItems.reduce((sum, item) => sum + Number(item.value), 0)

    if (totalGoalValue === 0) return 0

    const alignmentScore = (totalWalletValue / totalGoalValue) * 100
    return Math.min(alignmentScore, 100) // Cap at 100%
  }
}
