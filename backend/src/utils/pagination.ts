import type { PaginatedResponse } from "../types"

export interface PaginationParams {
  page: number
  limit: number
}

export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  const skip = (page - 1) * limit

  return {
    skip,
    take: limit,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
): PaginatedResponse<T> {
  return {
    data,
    pagination,
  }
}
