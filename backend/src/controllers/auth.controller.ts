import type { FastifyRequest, FastifyReply } from "fastify"
import type { AuthService } from "../services/auth.service"
import { CreateUserSchema, LoginSchema } from "../models/user.model"
import { ValidationError } from "../utils/errors"

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = CreateUserSchema.parse(request.body)
      const user = await this.authService.register(data)

      const token = request.server.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      reply.status(201).send({
        user,
        token,
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new ValidationError(error.errors[0].message)
      }
      throw error
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = LoginSchema.parse(request.body)
      const user = await this.authService.login(data)

      const token = request.server.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      reply.send({
        user,
        token,
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new ValidationError(error.errors[0].message)
      }
      throw error
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    reply.send({ user: request.user })
  }
}
