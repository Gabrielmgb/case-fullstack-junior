import type { FastifyInstance } from "fastify"
import { AuthController } from "../controllers/auth.controller"
import { AuthService } from "../services/auth.service"
import { authenticate } from "../utils/auth"

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.prisma)
  const authController = new AuthController(authService)

  // Public routes
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Registrar novo usuário",
        body: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            name: { type: "string", minLength: 2 },
            role: { type: "string", enum: ["ADVISOR", "VIEWER"] },
          },
        },
      },
    },
    authController.register.bind(authController),
  )

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Fazer login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
      },
    },
    authController.login.bind(authController),
  )

  // Protected routes
  fastify.get(
    "/me",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Obter dados do usuário logado",
        security: [{ Bearer: [] }],
      },
    },
    authController.me.bind(authController),
  )
}
