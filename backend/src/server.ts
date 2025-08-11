import Fastify from "fastify"
import { PrismaClient } from "@prisma/client"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import dotenv from "dotenv"

import { authRoutes } from "./routes/auth.routes"
import { clientRoutes } from "./routes/client.routes"
import { simulationRoutes } from "./routes/simulation.routes"
import { AppError } from "./utils/errors"

dotenv.config()

const prisma = new PrismaClient()

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
})

server.decorate("prisma", prisma)

// Register plugins
server.register(cors, {
  origin: process.env.NODE_ENV === "production" ? false : true,
})

server.register(jwt, {
  secret: process.env.JWT_SECRET || "fallback-secret-key",
})

server.register(swagger, {
  swagger: {
    info: {
      title: "Financial Planner API",
      description: "API for Financial Planning System",
      version: "1.0.0",
    },
    host: "localhost:3001",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
})

server.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
})

server.register(authRoutes, { prefix: "/api/auth" })
server.register(clientRoutes, { prefix: "/api/clients" })
// Added simulation routes
server.register(simulationRoutes, { prefix: "/api/simulations" })

// Health check
server.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() }
})

server.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      error: error.message,
      statusCode: error.statusCode,
    })
    return
  }

  // Log unexpected errors
  request.log.error(error)

  reply.status(500).send({
    error: "Erro interno do servidor",
    statusCode: 500,
  })
})

// Graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  try {
    await prisma.$disconnect()
    await server.close()
    process.exit(0)
  } catch (error) {
    console.error("Error during shutdown:", error)
    process.exit(1)
  }
}

process.on("SIGTERM", gracefulShutdown)
process.on("SIGINT", gracefulShutdown)

const start = async (): Promise<void> => {
  try {
    const port = Number.parseInt(process.env.PORT || "3001")
    await server.listen({ port, host: "0.0.0.0" })
    console.log(`Server running on http://localhost:${port}`)
    console.log(`Swagger docs available at http://localhost:${port}/docs`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient
  }
  interface FastifyRequest {
    user?: {
      userId: string
      email: string
      role: string
    }
  }
}

start()

export { server, prisma }
