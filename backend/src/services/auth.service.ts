import bcrypt from "bcryptjs"
import type { PrismaClient } from "@prisma/client"
import type { CreateUserInput, LoginInput } from "../models/user.model"
import { AppError, UnauthorizedError } from "../utils/errors"

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(data: CreateUserInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new AppError("Email já está em uso", 409)
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return user
  }

  async login(data: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new UnauthorizedError("Credenciais inválidas")
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError("Credenciais inválidas")
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }
}
