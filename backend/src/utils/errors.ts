export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403)
  }
}
