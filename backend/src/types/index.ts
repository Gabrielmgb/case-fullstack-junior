export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export interface AuthenticatedRequest {
  user: JWTPayload
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AlignmentCategory {
  range: string
  color: string
  label: string
}

export const ALIGNMENT_CATEGORIES: AlignmentCategory[] = [
  { range: "> 90%", color: "green", label: "Bem alinhado" },
  { range: "90% a 70%", color: "yellow-light", label: "Moderadamente alinhado" },
  { range: "70% a 50%", color: "yellow-dark", label: "Pouco alinhado" },
  { range: "< 50%", color: "red", label: "Desalinhado" },
]

export interface WealthProjectionParams {
  initialWealth: number
  events: Array<{
    value: number
    frequency: "ONCE" | "MONTHLY" | "YEARLY"
    startDate: Date
    endDate?: Date
  }>
  projectionRate: number
  endYear?: number
}

export interface ProjectionResult {
  year: number
  projectedValue: number
}
