// Shared types between frontend and backend
export interface User {
  id: string
  email: string
  name: string
  role: "ADVISOR" | "VIEWER"
  createdAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  age: number
  isActive: boolean
  familyProfile?: string
  totalWealth: number
  createdAt: string
  updatedAt: string
  goals?: Goal[]
  walletItems?: WalletItem[]
  _count?: {
    goals: number
    walletItems: number
    events: number
    simulations: number
  }
}

export interface Goal {
  id: string
  title: string
  description?: string
  type: GoalType
  targetValue: number
  targetDate: string
  priority: number
  createdAt: string
  updatedAt: string
  clientId: string
}

export interface WalletItem {
  id: string
  assetClass: string
  percentage: number
  value: number
  createdAt: string
  updatedAt: string
  clientId: string
}

export interface Event {
  id: string
  title: string
  description?: string
  type: EventType
  value: number
  frequency: EventFrequency
  startDate: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  clientId: string
}

export interface Simulation {
  id: string
  title: string
  description?: string
  initialWealth: number
  projectionRate: number
  projectionData: ProjectionData[]
  alignmentScore?: number
  suggestions?: Suggestion[]
  createdAt: string
  clientId: string
  client?: {
    id: string
    name: string
    email: string
  }
}

export interface ProjectionData {
  year: number
  projectedValue: number
}

export interface Suggestion {
  type: string
  description: string
  impact?: number
  priority?: number
}

export interface AlignmentResult {
  clientId: string
  alignmentScore: number
  category: "green" | "yellow-light" | "yellow-dark" | "red"
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

// Enums
export type GoalType =
  | "RETIREMENT"
  | "SHORT_TERM"
  | "MEDIUM_TERM"
  | "LONG_TERM"
  | "EMERGENCY_FUND"
  | "EDUCATION"
  | "REAL_ESTATE"
  | "OTHER"

export type EventType = "CONTRIBUTION" | "WITHDRAWAL" | "INCOME_CHANGE" | "EXPENSE_CHANGE" | "BONUS" | "OTHER"

export type EventFrequency = "ONCE" | "MONTHLY" | "YEARLY"

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  role?: "ADVISOR" | "VIEWER"
}

export interface ClientForm {
  name: string
  email: string
  age: number
  isActive?: boolean
  familyProfile?: string
  totalWealth?: number
}

export interface GoalForm {
  title: string
  description?: string
  type: GoalType
  targetValue: number
  targetDate: string
  priority?: number
}

export interface SimulationForm {
  title: string
  description?: string
  initialWealth: number
  projectionRate: number
  clientId: string
}
