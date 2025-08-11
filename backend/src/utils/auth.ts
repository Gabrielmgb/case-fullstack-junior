import type { FastifyRequest, FastifyReply } from "fastify"
import type { JWTPayload } from "../types"

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const payload = await request.jwtVerify<JWTPayload>()
    request.user = payload
  } catch (err) {
    reply.status(401).send({ error: "Token inválido ou expirado" })
  }
}

export function authorize(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({ error: "Não autenticado" })
      return
    }

    if (!roles.includes(request.user.role)) {
      reply.status(403).send({ error: "Acesso negado" })
      return
    }
  }
}
